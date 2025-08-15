const mongoose = require("mongoose");
const XLSX = require("xlsx");
const path = require("path");
const SAPUser = require("./sap.model"); // exports your SAPUserNew model

const MONGO_URI = "mongodb://localhost:27017/sap-database";
const EXCEL_FILE = "14-aug-2025-dump.xlsx";
const SHEET_NAME = process.env.SHEET_NAME || null;

/* ---------------------- Header resolution ---------------------- */
const canonicalize = (s) =>
  String(s || "")
    .toLowerCase()
    .replace(/\(.*?\)/g, "")
    .replace(/[^a-z0-9]+/g, " ")
    .replace(/\s+/g, " ")
    .trim();

const stripSpaces = (s) => String(s || "").replace(/\s+/g, "").toLowerCase();

const COL_ALIASES = {
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
    emailKey: resolve("email"),
    contractTypeKey: resolve("contractType"),
  };
}

/* ---------------------- Normalization helpers ---------------------- */
const normEmail = (v) =>
  String(v ?? "")
    .trim()
    .toLowerCase()
    .replace(/\u00A0/g, ""); // remove non-breaking spaces

/* ---------------------- Main ---------------------- */
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

    console.log(`Using sheet: ${sheetName}. Available: ${workbook.SheetNames.join(", ")}`);
    const sheet = workbook.Sheets[sheetName];
    const rows = XLSX.utils.sheet_to_json(sheet, { defval: "" });
    if (!rows.length) {
      console.log("No rows found in the selected sheet.");
      return;
    }

    // Resolve headers
    const { emailKey, contractTypeKey } = buildHeaderMap(rows[0]);
    console.log("Resolved headers:", { emailKey, contractTypeKey });
    if (!emailKey) throw new Error("Could not resolve 'EmailAddress' column.");

    // Build Excel map of unique emails
    const excelMap = new Map();
    for (const row of rows) {
      const email = normEmail(row[emailKey]);
      if (!email) continue;
      if (!excelMap.has(email)) {
        excelMap.set(email, {
          EmailAddress: email,
          ContractType: contractTypeKey ? row[contractTypeKey] || "Unknown" : "Unknown",
        });
      }
    }
    const excelEmails = Array.from(excelMap.keys());
    console.log("Excel unique emails:", excelEmails.length);

    // Load ALL emails from DB
    const dbDocs = await SAPUser.find({}, { _id: 0, email: 1, EmailAddress: 1 }).lean();
    console.log("Fetched emails from DB:", dbDocs.length);

    const dbEmailSet = new Set();
    for (const d of dbDocs) {
      if (d.email) dbEmailSet.add(normEmail(d.email));
      if (d.EmailAddress) dbEmailSet.add(normEmail(d.EmailAddress));
    }
    console.log("Unique emails in DB set:", dbEmailSet.size);

    // Excel-only (new) = in Excel but not in DB
    const newRecords = [];
    for (const email of excelEmails) {
      if (!dbEmailSet.has(email)) {
        newRecords.push(excelMap.get(email));
      }
    }

    console.log("\n📌 Emails present in Excel but NOT in SAP DB (NEW)");
    console.log(`Total New Records: ${newRecords.length}`);

    if (!newRecords.length) {
      console.log("No new emails found.");
      return;
    }

    // Group by ContractType and print
    const byContract = new Map();
    for (const r of newRecords) {
      const key = r.ContractType || "Unknown";
      if (!byContract.has(key)) byContract.set(key, []);
      byContract.get(key).push(r);
    }

    const ordered = Array.from(byContract.entries()).sort(
      (a, b) => b[1].length - a[1].length
    );

    for (const [contractType, items] of ordered) {
      console.log(`\n📊 Contract Type: ${contractType} — New Emails: ${items.length}`);
      const tableData = items
        .sort((a, b) => a.EmailAddress.localeCompare(b.EmailAddress))
        .map((x, i) => ({
          "#": i + 1,
          EmailAddress: x.EmailAddress,
        }));
      console.table(tableData);
    }
  } catch (err) {
    console.error("❌ Error:", err);
  } finally {
    await mongoose.disconnect();
    console.log("Disconnected from MongoDB");
  }
})();



// Based on Email
// Contract Type: NEOM Full Time — Missing Count: 146
// Contract Type: Spouse — Missing Count: 1
// Contract Type: SMP — Missing Count: 20


// Based on Employee Number

// Excel unique EmployeeNumbers (canonical): 5790
// Fetched employee numbers from DB: 5761
// Unique canonical keys in DB set: 5760

// 📌 Excel → DB: NEW records (in Excel, not in DB) --> Total New Records: 190
// DB → Excel: Missing in Excel (stale/extra in DB): ---> 160

// 📊 Contract Type: NEOM Full Time — New Records: 147
// 📊 Contract Type: SMP — New Records: 42
// 📊 Contract Type: Spouse — New Records: 1