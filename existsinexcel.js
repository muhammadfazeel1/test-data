const mongoose = require("mongoose");
const XLSX = require("xlsx");
const path = require("path");
const SAPUser = require("./sap.model"); // Ensure this is the correct model path

const MONGO_URI = "mongodb://localhost:27017/sap-database";

(async () => {
  try {
    await mongoose.connect(MONGO_URI);
    console.log("Connected to MongoDB");

    // 1) Load Excel
    const filePath = path.join(__dirname, "14-aug-2025-dump.xlsx");
    const workbook = XLSX.readFile(filePath);
    const sheetName = workbook.SheetNames[0];
    const sheet = workbook.Sheets[sheetName];
    const rows = XLSX.utils.sheet_to_json(sheet);

    // 2) Extract unique emails from Excel
    const excelMap = new Map(); // email -> { EmployeeNumber, EmailAddress }
    for (const row of rows) {
      const email = row["EmailAddress"];
      if (!email) continue;

      const cleanEmail = String(email).trim().toLowerCase();
      if (!cleanEmail) continue;

      if (!excelMap.has(cleanEmail)) {
        excelMap.set(cleanEmail, {
          EmployeeNumber: row["EmployeeNumber"] || "",
          EmailAddress: cleanEmail,
        });
      }
    }

    const excelEmails = Array.from(excelMap.keys());
    if (excelEmails.length === 0) {
      console.log("No EmailAddress values found in Excel.");
      await mongoose.disconnect();
      return;
    }

    // 3) Get existing emails from DB
    //    Change "email" if your schema uses another field name
    const existing = await SAPUser.find(
      { email: { $in: excelEmails } },
      { _id: 0, email: 1 }
    ).lean();

    const existingSet = new Set(
      existing.map((doc) => String(doc.email).trim().toLowerCase())
    );

    // 4) Compute Excel-only (missing in DB)
    const missingList = excelEmails
      .filter((email) => !existingSet.has(email))
      .map((email) => excelMap.get(email));

    // 5) Output
    console.log("\n📌 Emails present in Excel but NOT in SAP DB");
    console.log(`Count: ${missingList.length}`);
    if (missingList.length) {
      console.table(
        missingList.map((x, i) => ({
          "#": i + 1,
          EmployeeNumber: x.EmployeeNumber,
          EmailAddress: x.EmailAddress,
        }))
      );
    }

    await mongoose.disconnect();
  } catch (err) {
    console.error("❌ Error:", err);
    try {
      await mongoose.disconnect();
    } catch {}
  }
})();
