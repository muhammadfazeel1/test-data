const mongoose = require("mongoose");
const XLSX = require("xlsx");
const path = require("path");
const SAPUser = require("./sap.model"); // Make sure this path is correct

const MONGO_URI = "mongodb://localhost:27017/sap-database";

// Helper to normalize nationality
function isSaudi(nationality) {
  if (!nationality) return false;
  const val = nationality.toLowerCase();
  return val.includes("saudi") || val.includes("ksa") || val.includes("sau");
}

// Helper to combine contract type counts
function getContractTypeCategory(contractType) {
  if (!contractType) return "Unknown";
  const clean = contractType.toLowerCase();
  if (clean.includes("full")) return "NEOM Full Time";
  if (clean.includes("smp")) return "SMP";
  return "Other";
}

(async () => {
  try {
    await mongoose.connect(MONGO_URI);
    console.log("Connected to MongoDB");

    const filePath = path.join(__dirname, "sap-13-aug-2025-dump.xlsx");
    const workbook = XLSX.readFile(filePath);
    const sheetName = workbook.SheetNames[0];
    const sheet = workbook.Sheets[sheetName];
    const data = XLSX.utils.sheet_to_json(sheet);

    // Metrics
    let total = 0;
    let totalFullTime = 0;
    let totalSMP = 0;
    let totalSaudi = 0;
    let totalNonSaudi = 0;
    let totalMissingNationality = 0;
    let totalFullTimeWithIqama = 0;
    let totalSMPWithIqama = 0;
    let nonSaudiFullTimeWithoutIqama = 0;
    let nonSaudiSMPWithoutIqama = 0;

    const unknownContracts = {}; // { 'Intern': [user1, user2] }

    for (const row of data) {
      total++;

      const contractType = row["ContractType"];
      const employeeNumber = row["EmployeeNumber"];
      const email = row["EmailAddress"];
      const iqama = row["Iqama Number"];
      const nationality = row["Nationality"];

      const isKSA = isSaudi(nationality);
      const hasIqama = !!(iqama && iqama.toString().trim());

      if (!nationality) totalMissingNationality++;

      if (isKSA) totalSaudi++;
      else totalNonSaudi++;

      const category = getContractTypeCategory(contractType);

      if (category === "NEOM Full Time") {
        totalFullTime++;
        if (hasIqama) totalFullTimeWithIqama++;
        if (!isKSA && !hasIqama) nonSaudiFullTimeWithoutIqama++;
      } else if (category === "SMP") {
        totalSMP++;
        if (hasIqama) totalSMPWithIqama++;
        if (!isKSA && !hasIqama) nonSaudiSMPWithoutIqama++;
      } else {
        if (!unknownContracts[contractType]) unknownContracts[contractType] = [];
        unknownContracts[contractType].push({
          EmployeeNumber: employeeNumber,
          EmailAddress: email,
          ContractType: contractType || "Unknown",
        });
      }
    }

    // Summary Table
    console.log("\n📊 Employee Summary");
    console.table({
      "Total Employees": total,
      "NEOM Full Time": totalFullTime,
      "SMP": totalSMP,
      "Saudi": totalSaudi,
      "Non-Saudi": totalNonSaudi,
      "Full Time with Iqama": totalFullTimeWithIqama,
      "SMP with Iqama": totalSMPWithIqama,
      "Non-Saudi Full Time without Iqama": nonSaudiFullTimeWithoutIqama,
      "Non-Saudi SMP without Iqama": nonSaudiSMPWithoutIqama,
      "Missing Nationality": totalMissingNationality,
      "Unknown Contract Types": Object.keys(unknownContracts).length
    });

    // Unknown Contract Type Summary
    if (Object.keys(unknownContracts).length > 0) {
      console.log("\n🟠 Unknown Contract Type Summary");
      const summaryTable = Object.entries(unknownContracts).map(([key, users]) => ({
        ContractType: key || "Unknown",
        "User Count": users.length
      }));
      console.table(summaryTable);

      console.log(`\n🧾 Unknown Contract Type User Details:`);
      let userIndex = 1;
      const allUsers = [];
      for (const [type, users] of Object.entries(unknownContracts)) {
        for (const u of users) {
          allUsers.push({
            "#": userIndex++,
            EmployeeNumber: u.EmployeeNumber,
            EmailAddress: u.EmailAddress,
            ContractType: u.ContractType
          });
        }
      }
      console.table(allUsers);
    }

    await mongoose.disconnect();
  } catch (err) {
    console.error("❌ Error:", err);
  }
})();
