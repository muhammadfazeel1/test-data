const xlsx = require("xlsx");
const mongoose = require("mongoose");
const path = require("path");

// ✅ Replace with your MongoDB connection string
const MONGO_URI = "mongodb://localhost:27017/sap-database";

// ✅ Import your schema
const SAPUser = require("./sap.model"); // Adjust path

// ✅ Normalize email to lowercase
const toLower = (val) => (val || "").toString().toLowerCase();

// ✅ Main function
async function updatePassportNumbers() {
  try {
    await mongoose.connect(MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log("✅ Connected to MongoDB");

    const filePath = path.join(__dirname, "./SAP & Muqeem Data 7_24_2025 v1.6.xlsx"); // Adjust filename
    const workbook = xlsx.readFile(filePath);
    const sheet = workbook.Sheets[workbook.SheetNames[0]];
    const rows = xlsx.utils.sheet_to_json(sheet, { defval: "" });

    let updatedCount = 0;
    let notFound = [];

    for (const row of rows) {
      const email = toLower(row?.EmailAddress);
      const employeeNumber = row?.EmployeeNumber?.toString().trim();
      const newPassportNo = row?.Passport || "";

      if (!email || !employeeNumber || !newPassportNo) continue;

      const user = await SAPUser.findOne({
        email,
        employeeNumber,
      });

      if (user) {
        if (user.passportNo !== newPassportNo) {
          user.passportNo = newPassportNo;
          await user.save();
          updatedCount++;
          console.log(`📝 Updated passport for ${email}`);
        }
      } else {
        notFound.push({ email, employeeNumber });
      }
    }

    console.log(`✅ Total updated: ${updatedCount}`);
    if (notFound.length) {
      console.log(`⚠️ ${notFound.length} records not found in DB`);
    }

    await mongoose.disconnect();
    console.log("🔌 Disconnected from MongoDB");

  } catch (err) {
    console.error("❌ Error:", err);
    process.exit(1);
  }
}

updatePassportNumbers();

// From all sap production records No Passport found in after migration: 3486
// From all sap production records Passport found in  after migration : 2273

// Updated with query: 2272