/* eslint-disable no-console */
const xlsx = require("xlsx");
const mongoose = require("mongoose");
const fs = require("fs");
const path = require("path");

// ---- CONFIG -------------------------------------------------
const MONGO_URI = "mongodb://127.0.0.1:27017/sap-database";
const EXCEL_FILE = path.join(__dirname, "updatedRecordsMuqeemMerged.xlsx");

// Your latest schema model
const SAPUser = require("../sap.model");

// ---- UTILITIES ----------------------------------------------
const excelEpoch = new Date(Date.UTC(1899, 11, 30));
const toISODate = (d) => (d ? new Date(d).toISOString().slice(0, 10) : "");
const cleanStr = (v) => (v == null ? "" : String(v).trim());
const lower = (v) => cleanStr(v).toLowerCase();

function parseExcelDate(value) {
  if (!value) return "";
  if (typeof value === "number") {
    const date = new Date(excelEpoch.getTime() + value * 86400 * 1000);
    return toISODate(date);
  }
  if (value instanceof Date) return toISODate(value);
  const parsed = new Date(value);
  return Number.isNaN(parsed.getTime()) ? "" : toISODate(parsed);
}

// When the schema field is Date (not string)
function parseExcelDateAsDate(value) {
  const iso = parseExcelDate(value);
  return iso ? new Date(iso) : null;
}

// (safety) normalize aliases so we don't crash if a string/undefined is passed
function normalizeAliases(aliases) {
  if (!aliases) return [];
  if (Array.isArray(aliases)) return aliases;
  if (typeof aliases === "string") return [aliases];
  return [];
}

// prefer first non-empty value from a list of header aliases
function firstValue(row, aliases, { transform } = {}) {
  const keys = normalizeAliases(aliases);
  for (const key of keys) {
    if (row[key] !== undefined && row[key] !== null && row[key] !== "") {
      const v = row[key];
      return transform ? transform(v) : v;
    }
  }
  return "";
}

// date getters
function firstDate(row, aliases) {
  return parseExcelDate(firstValue(row, aliases));
}
function firstDateAsDate(row, aliases) {
  const v = firstValue(row, aliases);
  return parseExcelDateAsDate(v);
}

// parse ObjectId if valid
function parseObjectId(id) {
  const s = cleanStr(id);
  if (!s) return null;
  return mongoose.Types.ObjectId.isValid(s) ? new mongoose.Types.ObjectId(s) : null;
}

// ---- HEADER ALIASES (your list, unchanged except adding _id) ----
const A = {
  _id: ["_id"],

  employeeNumber: ["EmployeeNumber", "Employee Number"],
  firstName: ["FirstName"],
  secondName: ["SecondName"],
  thirdName: ["ThirdName"],
  lastName: ["LastName"],

  // optional Arabic names
  firstNameAr: ["ArabicFirstName", "FirstNameAr"],
  secondNameAr: ["ArabicSecondName", "SecondNameAr"],
  thirdNameAr: ["ArabicThirdName", "ThirdNameAr"],
  lastNameAr: ["ArabicLastName", "LastNameAr"],

  gender: ["Gender_x"], // keep x as your source of truth
  nationality: ["Nationality_x"],
  fullNationality: ["Full Nationality"], // not mapped to schema
  maritalStatus: ["MaritalStatus"],
  religion: ["Religion"],
  birthCountry: ["BirthCountry"],

  email: ["EmailAddress"],
  phoneNO: ["PhoneNumber"],

  sector: ["Sector"],
  sectorCode: ["SectorCode"],
  sectorHead: ["Sector Head"],

  // sector head details
  sectorHeadFirstName: ["Sector Head First Name"],
  sectorHeadLastName: ["Sector Head Last Name"],
  sectorHeadEmail: ["Sector Head Email"],

  positionName: ["Position Name"],

  division: ["Division"],
  divisionCode: ["DivisionCode"],
  divisionHeadOfUnit: ["Division Head"],

  department: ["Department"],
  departmentCode: ["DepartmentCode"],

  constCenterAccount: ["CostCentreAccount"],
  constCenterAccountCode: ["CostCentreAccountCode"],

  contractType: ["ContractType"],
  managerID: ["ManagerID"],
  managerName: ["ManagerName"],
  managerEmail: ["ManagerEmail"],
  employeeStatus: ["EmployeeStatus"],
  jobTitle: ["JobTitle"],
  hireDate: ["EmployeeHireDate"],

  // treat either SeparationDate or Last Working Day as separationDate
  separationDate: ["SeparationDate", "Last Working Day"],

  // Iqama / Passport (as in your code)
  iqamaNumber: ["Iqama Number"],
  iqamaExpiry: ["Iqama Expiry Date_x"],
  passportNo: ["Passport", "Passport Number"],
  passportIssuanceCountry: ["PassportIssuanceCountry"],
  passportExpiry: ["Passport Expiry Date"],

  workVisa: ["WorkVisa"],
  SNI: ["SNI"],

  passports: ["Passport"],
  passportExpiries: ["Passport Expiry Date"],
  passportCountries: ["PassportIssuanceCountry"],

  companyCode: ["Company (externalCode)"],
  companyName: ["Company (Label)", "Company"],

  contractEndDate: ["Contract End Date"],
  contractPeriod: ["Contract Period (Picklist Label)"],
  probationPeriod: ["Probation Period (Picklist Label)"],
  standardWeeklyHours: ["Standard Weekly Hours"],
  locationGroup: ["Location Group (Name)"],
  workLocation: ["Work Location (Name)"],

  lastWorkingDay: ["Last Working Day"],
  leavingReason: ["Leaving Reason (Picklist Label)"], // as in your file
  presentAddress: ["Present Address"],

  // Muqeem (only the ones you kept)
  muqeemPassportExpiry: ["Passport Expiry Date"],
  muqeemIqamaIssueDate: ["Iqama Issue Date"],
  muqeemName: ["Name"],
  muqeemNationality: ["Nationality_y"],
  muqeemJobTitle: ["Occupation"],
  muqeemExitReEntryVisaIssuePlace: ["Exit Reentry Visa Issue Place"],

  // not stored, optional debug
  employerNumber: ["EmployerNumber"],

  // intentionally ignored:
  // "Outside The Kingdom" (Exit/Re-Entry)
  // "Birth Date" (no field in schema)
};

// ---- VALIDATION (soft) --------------------------------------
function validateRow(rowObj) {
  const missing = [];
  if (!rowObj._id && !rowObj.employeeNumber && !rowObj.email)
    missing.push("_id|employeeNumber|email (need one as identifier)");
  if (!rowObj.firstName) missing.push("firstName");
  if (!rowObj.lastName) missing.push("lastName");
  return missing;
}

// ---- MAP A ROW → SCHEMA DOC --------------------------------
function mapRowToDoc(raw) {
  const excelId = firstValue(raw, A._id);
  const objectId = parseObjectId(excelId);

  const email = lower(firstValue(raw, A.email));
  const managerEmail = lower(firstValue(raw, A.managerEmail));
  const sectorHeadEmail = lower(firstValue(raw, A.sectorHeadEmail));

  const sectorHeadName =
    `${cleanStr(firstValue(raw, A.sectorHeadFirstName))} ${cleanStr(firstValue(raw, A.sectorHeadLastName))}`.trim() || "";

  const doc = {
    // identifiers
    _id: objectId || undefined, // used only in filter; never set/updated
    employeeNumber: cleanStr(firstValue(raw, A.employeeNumber)),
    email,

    // names
    firstName: cleanStr(firstValue(raw, A.firstName)),
    secondName: cleanStr(firstValue(raw, A.secondName)),
    thirdName: cleanStr(firstValue(raw, A.thirdName)),
    lastName: cleanStr(firstValue(raw, A.lastName)),

    // Arabic (optional)
    firstNameAr: cleanStr(firstValue(raw, A.firstNameAr)),
    secondNameAr: cleanStr(firstValue(raw, A.secondNameAr)),
    thirdNameAr: cleanStr(firstValue(raw, A.thirdNameAr)),
    lastNameAr: cleanStr(firstValue(raw, A.lastNameAr)),

    gender: cleanStr(firstValue(raw, A.gender)),
    nationality: cleanStr(firstValue(raw, A.nationality)),
    maritalStatus: cleanStr(firstValue(raw, A.maritalStatus)),
    religion: cleanStr(firstValue(raw, A.religion)),
    birthCountry: cleanStr(firstValue(raw, A.birthCountry)),

    phoneNO: cleanStr(firstValue(raw, A.phoneNO)),

    sector: cleanStr(firstValue(raw, A.sector)),
    sectorCode: cleanStr(firstValue(raw, A.sectorCode)),
    sectorHead: cleanStr(firstValue(raw, A.sectorHead)),
    sectorHeadName,
    sectorHeadEmail,

    positionName: cleanStr(firstValue(raw, A.positionName)),

    division: cleanStr(firstValue(raw, A.division)),
    divisionCode: cleanStr(firstValue(raw, A.divisionCode)),
    divisionHeadOfUnit: cleanStr(firstValue(raw, A.divisionHeadOfUnit)),

    department: cleanStr(firstValue(raw, A.department)),
    departmentCode: cleanStr(firstValue(raw, A.departmentCode)),

    constCenterAccount: cleanStr(firstValue(raw, A.constCenterAccount)),
    constCenterAccountCode: cleanStr(firstValue(raw, A.constCenterAccountCode)),

    contractType: cleanStr(firstValue(raw, A.contractType)),
    managerID: cleanStr(firstValue(raw, A.managerID)),
    managerName: cleanStr(firstValue(raw, A.managerName)),
    managerEmail,

    employeeStatus: cleanStr(firstValue(raw, A.employeeStatus)),
    jobTitle: cleanStr(firstValue(raw, A.jobTitle)),

    hireDate: firstDate(row = raw, aliases = A.hireDate),

    // schema type is Date
    separationDate: firstDateAsDate(raw, A.separationDate),

    iqamaNumber: cleanStr(firstValue(raw, A.iqamaNumber)),
    iqamaExpiry: firstDate(raw, A.iqamaExpiry),

    passportNo: cleanStr(firstValue(raw, A.passportNo)),
    passportIssuanceCountry: cleanStr(firstValue(raw, A.passportIssuanceCountry)),
    passportExpiry: firstDate(raw, A.passportExpiry),

    workVisa: cleanStr(firstValue(raw, A.workVisa)),
    SNI: cleanStr(firstValue(raw, A.SNI)),

    passports: (() => {
      const v = firstValue(raw, A.passports);
      if (Array.isArray(v)) return v.map(cleanStr).filter(Boolean);
      return [cleanStr(v)].filter(Boolean);
    })(),
    passportExpiries: (() => {
      const v = firstValue(raw, A.passportExpiries);
      if (Array.isArray(v)) return v.map(parseExcelDate).filter(Boolean);
      const one = parseExcelDate(v);
      return one ? [one] : [];
    })(),
    passportCountries: (() => {
      const v = firstValue(raw, A.passportCountries);
      if (Array.isArray(v)) return v.map(cleanStr).filter(Boolean);
      return [cleanStr(v)].filter(Boolean);
    })(),

    companyCode: cleanStr(firstValue(raw, A.companyCode)),
    companyName: cleanStr(firstValue(raw, A.companyName)),

    contractEndDate: firstDate(raw, A.contractEndDate),
    contractPeriod: cleanStr(firstValue(raw, A.contractPeriod)),
    probationPeriod: cleanStr(firstValue(raw, A.probationPeriod)),
    standardWeeklyHours: cleanStr(firstValue(raw, A.standardWeeklyHours)),
    locationGroup: cleanStr(firstValue(raw, A.locationGroup)),
    workLocation: cleanStr(firstValue(raw, A.workLocation)),

    lastWorkingDay: firstDate(raw, A.lastWorkingDay),
    leavingReason: cleanStr(firstValue(raw, A.leavingReason)),
    presentAddress: cleanStr(firstValue(raw, A.presentAddress)),

    // Muqeem (only kept fields)
    muqeemPassportExpiry: firstDate(raw, A.muqeemPassportExpiry),
    muqeemIqamaIssueDate: firstDate(raw, A.muqeemIqamaIssueDate),
    muqeemName: cleanStr(firstValue(raw, A.muqeemName)),
    muqeemNationality: cleanStr(firstValue(raw, A.muqeemNationality)),
    muqeemJobTitle: cleanStr(firstValue(raw, A.muqeemJobTitle)),
    muqeemExitReEntryVisaIssuePlace: cleanStr(firstValue(raw, A.muqeemExitReEntryVisaIssuePlace)),

    validationStatus: "PASS",
  };

  const missing = validateRow(doc);
  if (missing.length) doc.validationStatus = "FAIL";

  return { doc, missing };
}

// ---- MAIN ---------------------------------------------------
async function run() {
  await mongoose.connect(MONGO_URI, { autoIndex: false });
  console.log("✅ Connected:", MONGO_URI);

  const wb = xlsx.readFile(EXCEL_FILE, { cellDates: true });
  const ws = wb.Sheets[wb.SheetNames[0]];
  const rows = xlsx.utils.sheet_to_json(ws, { defval: "", raw: true });

  const ops = [];
  const failed = [];

  for (const raw of rows) {
    const { doc, missing } = mapRowToDoc(raw);

    // Must have at least one identifier
    if (!doc._id && !doc.employeeNumber && !doc.email) {
      failed.push({ _id: raw._id, employeeNumber: doc.employeeNumber, email: doc.email, missing, raw });
      continue;
    }

    // Skip invalid name rows
    if (doc.validationStatus === "FAIL") {
      failed.push({ _id: raw._id, employeeNumber: doc.employeeNumber, email: doc.email, missing, raw });
      continue;
    }

    // Upsert key preference: _id > employeeNumber > email
    let filter = null;
    if (doc._id) filter = { _id: doc._id };
    else if (doc.employeeNumber) filter = { employeeNumber: doc.employeeNumber };
    else filter = { email: doc.email };

    // Do not overwrite with blanks / nulls / empty arrays
    // IMPORTANT: exclude validationStatus and _id from $set
    const $set = Object.fromEntries(
      Object.entries(doc).filter(
        ([k, v]) =>
          k !== "validationStatus" &&
          k !== "_id" &&
          !(v === "" || v === null || (Array.isArray(v) && v.length === 0))
      )
    );

    const update = { $set };
    if (doc.validationStatus) {
      update.$setOnInsert = { validationStatus: doc.validationStatus };
    }

    ops.push({
      updateOne: {
        filter,
        update,
        upsert: true,
      },
    });
  }

  if (ops.length) {
    const res = await SAPUser.bulkWrite(ops, { ordered: false });
    const matched = res.matchedCount ?? res.result?.nMatched ?? 0;
    const modified = res.modifiedCount ?? res.result?.nModified ?? 0;
    const upserted =
      res.upsertedCount ??
      res.result?.nUpserted ??
      (res.upsertedIds ? Object.keys(res.upsertedIds).length : 0);
    console.log(`🟢 Upserts complete. matched: ${matched}, modified: ${modified}, upserted: ${upserted}`);
  } else {
    console.log("ℹ️ No valid rows to upsert.");
  }

  if (failed.length) {
    const out = path.join(__dirname, "sap_failed_records.json");
    fs.writeFileSync(out, JSON.stringify(failed, null, 2));
    console.log(`⚠️ Wrote ${failed.length} failed rows → ${out}`);
  }

  await mongoose.disconnect();
  console.log("🔌 Disconnected.");
}

run().catch((e) => {
  console.error("❌ Fatal:", e);
  process.exit(1);
});
