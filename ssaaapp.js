const xlsx = require("xlsx");
const mongoose = require("mongoose");
const fs = require("fs");
const path = require("path");

// ✅ Replace with your MongoDB connection string
const MONGO_URI = "mongodb://localhost:27017/sap-database";

// ✅ Import your schema
const SAPUser = require("./sap.model"); // Adjust path

// ✅ Utility to convert Excel dates to yyyy-mm-dd
function parseExcelDate(value) {
  if (!value) return "";
  if (typeof value === "number") {
    const excelEpoch = new Date(Date.UTC(1899, 11, 30));
    const date = new Date(excelEpoch.getTime() + value * 86400 * 1000);
    return date.toISOString().split("T")[0];
  }
  if (value instanceof Date) return value.toISOString().split("T")[0];
  const parsed = new Date(value);
  return isNaN(parsed) ? "" : parsed.toISOString().split("T")[0];
}

// ✅ Validation based on schema expectations
function validateRequiredFields(row) {
  const missing = [];
  if (!row?.EmployeeNumber) missing.push("employeeNumber");
  if (!row?.FirstName) missing.push("firstName");
  if (!row?.LastName) missing.push("lastName");
  if (!row?.Gender) missing.push("gender");
  if (!row?.Nationality) missing.push("nationality");
  if (!row?.MaritalStatus) missing.push("maritalStatus");
  if (!row?.Religion) missing.push("religion");
  if (!row?.EmailAddress) missing.push("email");
  if (!row?.["Position Name"]) missing.push("positionName");
  if (!row?.Division) missing.push("division");
  if (!row?.DivisionCode) missing.push("divisionCode");
  if (!row?.["Division Head"]) missing.push("divisionHeadOfUnit");
  if (!row?.Department) missing.push("department");
  if (!row?.DepartmentCode) missing.push("departmentCode");
  if (!row?.CostCentreAccount) missing.push("constCenterAccount");
  if (!row?.CostCentreAccountCode) missing.push("constCenterAccountCode");
  if (!row?.ContractType) missing.push("contractType");
  // if (!row?.ManagerID) missing.push("managerID");
  // if (!row?.ManagerEmail) missing.push("managerEmail");
  if (!row?.EmployeeStatus) missing.push("employeeStatus");
  if (!row?.JobTitle) missing.push("jobTitle");
  if (!row?.EmployeeHireDate) missing.push("hireDate");
  return missing;
}

// ✅ Main function
async function importExcelToMongo() {
  try {
    await mongoose.connect(MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log("✅ Connected to MongoDB");

    const filePath = path.join(__dirname, "./Copy of PSCportalreport-13082025.xlsx"); // adjust filename
    const workbook = xlsx.readFile(filePath);
    const sheet = workbook.Sheets[workbook.SheetNames[0]];
    const rows = xlsx.utils.sheet_to_json(sheet, { defval: "" });

    const validRecords = [];
    const failedRecords = [];

    for (const data of rows) {
      const missing = validateRequiredFields(data);
      const isValid = missing.length === 0;

      const toLower = (val) => (val || "").toString().toLowerCase();

      const row = {
        employeeNumber: data?.EmployeeNumber || "",
        firstName: data?.FirstName || "",
        secondName: data?.SecondName || "",
        thirdName: data?.ThirdName || "",
        lastName: data?.LastName || "",
        firstNameAr: data?.ArabicFirstName || "",
        secondNameAr: data?.ArabicSecondName || "",
        thirdNameAr: data?.ArabicThirdName || "",
        lastNameAr: data?.ArabicLastName || "",
        gender: data?.Gender || "",
        nationality: data?.Nationality || "",
        maritalStatus: data?.MaritalStatus || "",
        religion: data?.Religion || "",
        birthCountry: data?.BirthCountry || "",
        email: toLower(data?.EmailAddress),
        phoneNO: data?.PhoneNumber || "",
        sector: data?.Sector || "",
        sectorCode: data?.SectorCode || "",
        sectorHead: data?.["Sector Head"] || "",
        sectorHeadName: data?.["Sector Head Name"] || "",
        sectorHeadEmail: toLower(data?.["Sector Head Email"]),
        positionName: data?.["Position Name"] || "",
        division: data?.Division || "",
        divisionCode: data?.DivisionCode || "",
        divisionHeadOfUnit: data?.["Division Head"] || "",
        department: data?.Department || "",
        departmentCode: data?.DepartmentCode || "",
        constCenterAccount: data?.CostCentreAccount || "",
        constCenterAccountCode: data?.CostCentreAccountCode || "",
        contractType: data?.ContractType || "",
        managerID: data?.ManagerID || "",
        managerName: data?.ManagerName || "",
        managerEmail: toLower(data?.ManagerEmail),
        employeeStatus: data?.EmployeeStatus || "",
        jobTitle: data?.JobTitle || "",
        hireDate: parseExcelDate(data?.EmployeeHireDate),
        separationDate: parseExcelDate(data?.SeparationDate),
        iqamaNumber: data?.["Iqama Number"] || "",
        iqamaExpiry: parseExcelDate(data?.["Iqama Expiry Date"]),
        passportNo: data?.Passport || "",
        passportIssuanceCountry: data?.PassportIssuanceCountry || "",
        passportExpiry: parseExcelDate(data?.PassportExpiryDate),
        workVisa: data?.WorkVisa || "",
        SNI: data?.SNI || "",
        passports: Array.isArray(data?.Passport)
          ? data?.Passport
          : [data?.Passport].filter(Boolean),
        passportExpiries: Array.isArray(data?.PassportExpiryDate)
          ? data?.PassportExpiryDate.map(parseExcelDate)
          : [parseExcelDate(data?.PassportExpiryDate)].filter(Boolean),
        passportCountries: Array.isArray(data?.PassportIssuanceCountry)
          ? data?.PassportIssuanceCountry
          : [data?.PassportIssuanceCountry].filter(Boolean),
        companyCode: data?.["Company Code"] || "",
        companyName: data?.Company || "",
        contractEndDate: parseExcelDate(data?.["Contract End Date"]),
        contractPeriod: data?.["Contract Period"] || "",
        probationPeriod: data?.["Probation Period"] || "",
        standardWeeklyHours: data?.["Standard Weekly Hours"] || "",
        locationGroup: data?.["Location Group"] || "",
        workLocation: data?.["Work Location"] || "",
        lastWorkingDay: parseExcelDate(data?.["Last Working Day"]),
        leavingReason: data?.["Leaving Reason"] || "",
        presentAddress: data?.["Present Address"] || "",
        validationStatus: isValid ? "PASS" : "FAIL",
        muqeemPassportExpiry: parseExcelDate(
          data?.["Muqeem Passport Expiry Date"]
        ),
        muqeemIqamaIssueDate: parseExcelDate(data?.["Muqeem Iqama Issue Date"]),
      };

      if (isValid) {
        validRecords.push(row);
      } else {
        failedRecords.push({
          employeeNumber: row.employeeNumber,
          missingFields: missing,
          data: row,
        });
      }
    }

    if (validRecords.length) {
      await SAPUser.insertMany(validRecords);
      console.log(`✅ Inserted ${validRecords.length} valid records`);
    }

    if (failedRecords.length) {
      fs.writeFileSync(
        path.join(__dirname, "sap_failed_records.json"),
        JSON.stringify(failedRecords, null, 2),
        "utf-8"
      );
      console.log(
        `⚠️ ${failedRecords.length} records failed validation and were saved to sap_failed_records.json`
      );
    }

    await mongoose.disconnect();
    console.log("🔌 Disconnected from MongoDB");
  } catch (err) {
    console.error("❌ Error:", err);
    process.exit(1);
  }
}

importExcelToMongo();
