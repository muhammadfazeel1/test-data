// existsinexcelbutnotinsap.js
const mongoose = require("mongoose");
const XLSX = require("xlsx");
const path = require("path");
const SAPUser = require("./sap.model"); // exports SAPUserNew

const MONGO_URI = "mongodb://localhost:27017/sap-database";
const EXCEL_FILE = "14-aug-2025-dump.xlsx";
const SHEET_NAME = process.env.SHEET_NAME || null;

/* ---------------------- Header resolution (robust) --------------------- */
const canonicalize = (s) =>
  String(s || "")
    .toLowerCase()
    .replace(/\(.*?\)/g, "")
    .replace(/[^a-z0-9]+/g, " ")
    .replace(/\s+/g, " ")
    .trim();

const stripSpaces = (s) => String(s || "").replace(/\s+/g, "").toLowerCase();

const COL_ALIASES = {
  employeeNumber: ["employee number", "employeenumber", "employee no", "employee id", "id"],
  email: ["email address", "emailaddress", "email", "work email", "workemail", "e-mail"],
  contractType: ["contract type", "contracttype", "contract"],
};

function buildHeaderMap(firstRowObj) {
  const canonicalToActual = {};
  const nospaceToActual = {};
  const seen = new Set();

  Object.keys(firstRowObj || {}).forEach((key) => {
    const can = canonicalize(key);
    const nos = stripSpaces(can);
    if (!seen.has(can)) {
      seen.add(can);
      canonicalToActual[can] = key;
    }
    nospaceToActual[nos] = key;
  });

  const resolve = (logical) => {
    for (const alias of COL_ALIASES[logical]) {
      if (canonicalToActual[alias]) return canonicalToActual[alias];
      const nos = stripSpaces(alias);
      if (nospaceToActual[nos]) return nospaceToActual[nos];
    }
    return null;
  };

  return {
    employeeNumberKey: resolve("employeeNumber"),
    emailKey: resolve("email"),
    contractTypeKey: resolve("contractType"),
  };
}

/* --------------------- Canonical digit normalization ------------------- */
// Map Arabic-Indic (U+0660–0669) and Eastern Arabic (U+06F0–06F9) to ASCII 0–9
function toAsciiDigits(str) {
  if (!str) return "";
  return String(str).replace(/[\u0660-\u0669\u06F0-\u06F9]/g, (ch) => {
    const code = ch.charCodeAt(0);
    if (code >= 0x0660 && code <= 0x0669) return String(code - 0x0660);
    if (code >= 0x06F0 && code <= 0x06F9) return String(code - 0x06F0);
    return ch;
  });
}

// Remove all non-digits after converting to ASCII digits
function digitsOnly(str) {
  return toAsciiDigits(str).replace(/\D+/g, "");
}

// Canonical form: ASCII digits only, strip leading zeros (keep "0")
function canonEmp(str) {
  const d = digitsOnly(str).replace(/^0+/, "");
  return d.length ? d : "0";
}

/* -------------------------------- Main -------------------------------- */
(async () => {
  try {
    await mongoose.connect(MONGO_URI);
    console.log("Connected to MongoDB");
    console.log("DB:", mongoose.connection.host + "/" + mongoose.connection.name);
    console.log("Model:", SAPUser.modelName, "Collection:", SAPUser.collection.name);

    // Load Excel
    const filePath = path.join(__dirname, EXCEL_FILE);
    const workbook = XLSX.readFile(filePath);
    if (!workbook.SheetNames?.length) throw new Error("No sheets found in the Excel file.");

    const sheetName =
      SHEET_NAME && workbook.SheetNames.includes(SHEET_NAME)
        ? SHEET_NAME
        : workbook.SheetNames[0];

    if (SHEET_NAME && sheetName !== SHEET_NAME) {
      console.warn(`⚠️ Sheet "${SHEET_NAME}" not found. Using "${sheetName}" instead.`);
    }
    console.log(`Using sheet: ${sheetName}. Available: ${workbook.SheetNames.join(", ")}`);

    const sheet = workbook.Sheets[sheetName];
    const rows = XLSX.utils.sheet_to_json(sheet, { defval: "" });
    if (!rows.length) {
      console.log("No rows found in the selected sheet.");
      return;
    }

    // Resolve headers
    const { employeeNumberKey, emailKey, contractTypeKey } = buildHeaderMap(rows[0]);
    console.log("Resolved headers:", { employeeNumberKey, emailKey, contractTypeKey });
    if (!employeeNumberKey) throw new Error("Could not resolve 'EmployeeNumber' column.");

    // Build Excel map with canonical keys
    const excelCanonToRow = new Map(); // canonEmp -> { EmployeeNumber, EmailAddress, ContractType }
    for (const row of rows) {
      const original = String(row[employeeNumberKey] ?? "");
      const canon = canonEmp(original);
      if (!canon) continue; // skip rows with no digits at all

      if (!excelCanonToRow.has(canon)) {
        excelCanonToRow.set(canon, {
          // keep a human-friendly display (ASCII digits only, keep original length)
          EmployeeNumber: digitsOnly(original),
          EmailAddress: emailKey ? String(row[emailKey] ?? "").trim().toLowerCase() : "",
          ContractType: contractTypeKey ? row[contractTypeKey] || "Unknown" : "Unknown",
          Nationality: row['Nationality'],
        });
      }
    }

    const excelCanonKeys = Array.from(excelCanonToRow.keys());
    console.log("Excel unique EmployeeNumbers (canonical):", excelCanonKeys.length);

    // Load ALL DB employee numbers once (fast for ~5-6k)
    const dbDocs = await SAPUser.find({}, { _id: 0, employeeNumber: 1, EmployeeNumber: 1 }).lean();
    console.log("Fetched employee numbers from DB:", dbDocs.length);

    // Build canonical set from DB numbers (handles number or string fields)
    const dbCanonSet = new Set();
    for (const d of dbDocs) {
      if (d.employeeNumber !== undefined && d.employeeNumber !== null) {
        dbCanonSet.add(canonEmp(d.employeeNumber));
      }
      if (d.EmployeeNumber !== undefined && d.EmployeeNumber !== null) {
        dbCanonSet.add(canonEmp(d.EmployeeNumber));
      }
    }
    console.log("Unique canonical keys in DB set:", dbCanonSet.size);

    // Excel-only (NEW): canonical not in DB canonical set
    const newRecords = [];
    for (const key of excelCanonKeys) {
      if (!dbCanonSet.has(key)) {
        newRecords.push(excelCanonToRow.get(key));
      }
    }

    // Optional: DB-only (stale in DB but not in Excel) — useful sanity check
    const excelCanonSet = new Set(excelCanonKeys);
    let dbOnlyCount = 0;
    for (const k of dbCanonSet) if (!excelCanonSet.has(k)) dbOnlyCount++;

    console.log("\n📌 Excel → DB: NEW records (in Excel, not in DB)");
    console.log(`Total New Records: ${newRecords.length}`);
    console.log(`DB → Excel: Missing in Excel (stale/extra in DB): ${dbOnlyCount}`);

    if (!newRecords.length) {
      console.log("No new employee numbers found.");
      return;
    }

    // Group by ContractType and print separate tables (largest first)
    const byContract = new Map();
    for (const r of newRecords) {
      const key = r.ContractType || "Unknown";
      if (!byContract.has(key)) byContract.set(key, []);
      byContract.get(key).push(r);
    }

    const ordered = Array.from(byContract.entries()).sort(
      (a, b) => b[1].length - a[1].length || String(a[0]).localeCompare(String(b[0]))
    );

    for (const [contractType, items] of ordered) {
      console.log(`\n📊 Contract Type: ${contractType} — New Records: ${items.length}`);
      const tableData = items
        .sort((a, b) => String(a.EmployeeNumber).localeCompare(String(b.EmployeeNumber)))
        .map((x, i) => ({
          "#": i + 1,
          EmployeeNumber: x.EmployeeNumber,
          EmailAddress: x.EmailAddress,
          Nationality: x.Nationality,
        }));
      console.table(tableData);
    }

    // Diagnostics: show first few “new” canonical keys to inspect formatting issues
    const sampleNew = newRecords.slice(0, 5).map((r) => r.EmployeeNumber);
    console.log("Sample NEW (first 5) after digit-normalization:", sampleNew);
  } catch (err) {
    console.error("❌ Error:", err);
  } finally {
    try {
      await mongoose.disconnect();
      console.log("Disconnected from MongoDB");
    } catch {}
  }
})();
