// existsInDuplicate.js
const mongoose = require("mongoose");
const XLSX = require("xlsx");
const path = require("path");
const fs = require("fs");
const SAPUser = require("./sap.model"); // your SAPUserNew model

const MONGO_URI = "mongodb://localhost:27017/sap-database";
const EXCEL_FILE = "14-aug-2025-dump.xlsx";
const SHEET_NAME = process.env.SHEET_NAME || null;
const EXPORT_CSV = true; // set true to write CSV files

/* ---------------------- header helpers ---------------------- */
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

/* ---------------------- normalizers ---------------------- */
// Email: trim, lowercase, remove NBSP
const normEmail = (v) => String(v ?? "").trim().toLowerCase().replace(/\u00A0/g, "");

// Employee number canonicalization:
// convert Arabic/Eastern Arabic digits → ASCII, keep digits only, strip leading zeros (keep "0")
function toAsciiDigits(str) {
  if (!str) return "";
  return String(str).replace(/[\u0660-\u0669\u06F0-\u06F9]/g, (ch) => {
    const c = ch.charCodeAt(0);
    if (c >= 0x0660 && c <= 0x0669) return String(c - 0x0660);
    if (c >= 0x06F0 && c <= 0x06F9) return String(c - 0x06F0);
    return ch;
  });
}
function digitsOnly(str) {
  return toAsciiDigits(str).replace(/\D+/g, "");
}
function canonEmp(str) {
  const d = digitsOnly(str).replace(/^0+/, "");
  return d.length ? d : "0";
}

/* ---------------------- counting utils ---------------------- */
function inc(map, key) {
  if (!key) return;
  map.set(key, (map.get(key) || 0) + 1);
}

function toCSV(rows, headers) {
  const esc = (v) =>
    String(v ?? "")
      .replace(/"/g, '""');
  const head = headers.join(",");
  const body = rows
    .map((r) => headers.map((h) => `"${esc(r[h])}"`).join(","))
    .join("\n");
  return head + "\n" + body;
}

/* ---------------------- main ---------------------- */
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

    const { employeeNumberKey, emailKey } = buildHeaderMap(rows[0]);
    console.log("Resolved headers:", { employeeNumberKey, emailKey });
    if (!emailKey) console.warn("⚠️ Could not resolve 'EmailAddress' column.");
    if (!employeeNumberKey) console.warn("⚠️ Could not resolve 'EmployeeNumber' column.");

    // Build counts from Excel
    const excelEmailCounts = new Map();
    const excelEmpCounts = new Map();
    for (const r of rows) {
      if (emailKey) {
        const e = normEmail(r[emailKey]);
        if (e) inc(excelEmailCounts, e);
      }
      if (employeeNumberKey) {
        const c = canonEmp(r[employeeNumberKey]);
        if (c) inc(excelEmpCounts, c);
      }
    }

    // Build counts from DB
    const dbDocs = await SAPUser.find(
      {},
      { _id: 0, email: 1, EmailAddress: 1, employeeNumber: 1, EmployeeNumber: 1 }
    ).lean();

    const dbEmailCounts = new Map();
    const dbEmpCounts = new Map();
    for (const d of dbDocs) {
      const email =
        d.email != null ? normEmail(d.email) :
        d.EmailAddress != null ? normEmail(d.EmailAddress) : "";
      if (email) inc(dbEmailCounts, email);

      const empRaw =
        d.employeeNumber != null ? String(d.employeeNumber) :
        d.EmployeeNumber != null ? String(d.EmployeeNumber) : "";
      const emp = canonEmp(empRaw);
      if (emp) inc(dbEmpCounts, emp);
    }

    // Duplicates = keys with count > 1 **within the same source**
    const excelDupEmails = Array.from(excelEmailCounts.entries())
      .filter(([_, n]) => n > 1)
      .map(([Email, ExcelCount]) => ({ Email, ExcelCount }))
      .sort((a, b) => b.ExcelCount - a.ExcelCount || a.Email.localeCompare(b.Email));

    const dbDupEmails = Array.from(dbEmailCounts.entries())
      .filter(([_, n]) => n > 1)
      .map(([Email, DBCount]) => ({ Email, DBCount }))
      .sort((a, b) => b.DBCount - a.DBCount || a.Email.localeCompare(b.Email));

    const excelDupEmp = Array.from(excelEmpCounts.entries())
      .filter(([_, n]) => n > 1)
      .map(([EmployeeNumber, ExcelCount]) => ({ EmployeeNumber, ExcelCount }))
      .sort((a, b) => b.ExcelCount - a.ExcelCount || a.EmployeeNumber.localeCompare(b.EmployeeNumber));

    const dbDupEmp = Array.from(dbEmpCounts.entries())
      .filter(([_, n]) => n > 1)
      .map(([EmployeeNumber, DBCount]) => ({ EmployeeNumber, DBCount }))
      .sort((a, b) => b.DBCount - a.DBCount || a.EmployeeNumber.localeCompare(b.EmployeeNumber));

    console.log("\n========== DUPLICATE EMAILS ==========");
    console.log(`Excel-only duplicates: ${excelDupEmails.length}`);
    if (excelDupEmails.length) console.table(excelDupEmails.slice(0, 20));
    console.log(`DB-only duplicates: ${dbDupEmails.length}`);
    if (dbDupEmails.length) console.table(dbDupEmails.slice(0, 20));

    console.log("\n====== DUPLICATE EMPLOYEE NUMBERS ======");
    console.log(`Excel-only duplicates: ${excelDupEmp.length}`);
    if (excelDupEmp.length) console.table(excelDupEmp.slice(0, 20));
    console.log(`DB-only duplicates: ${dbDupEmp.length}`);
    if (dbDupEmp.length) console.table(dbDupEmp.slice(0, 20));

    // Optional CSV export
    if (EXPORT_CSV) {
      if (excelDupEmails.length)
        fs.writeFileSync(
          path.join(__dirname, "duplicates_emails_excel.csv"),
          toCSV(excelDupEmails, ["Email", "ExcelCount"])
        );
      if (dbDupEmails.length)
        fs.writeFileSync(
          path.join(__dirname, "duplicates_emails_db.csv"),
          toCSV(dbDupEmails, ["Email", "DBCount"])
        );
      if (excelDupEmp.length)
        fs.writeFileSync(
          path.join(__dirname, "duplicates_employee_numbers_excel.csv"),
          toCSV(excelDupEmp, ["EmployeeNumber", "ExcelCount"])
        );
      if (dbDupEmp.length)
        fs.writeFileSync(
          path.join(__dirname, "duplicates_employee_numbers_db.csv"),
          toCSV(dbDupEmp, ["EmployeeNumber", "DBCount"])
        );
      console.log("\nCSV files written (if any duplicates were found):");
      console.log("- duplicates_emails_excel.csv");
      console.log("- duplicates_emails_db.csv");
      console.log("- duplicates_employee_numbers_excel.csv");
      console.log("- duplicates_employee_numbers_db.csv");
    }
  } catch (err) {
    console.error("❌ Error:", err);
  } finally {
    try {
      await mongoose.disconnect();
      console.log("Disconnected from MongoDB");
    } catch {}
  }
})();
