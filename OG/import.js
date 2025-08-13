const mongoose = require('mongoose');
const xlsx = require('xlsx');
const path = require('path');

// Load models
const Sector = require('./models/Sector');
const Division = require('./models/Division');
const Department = require('./models/Department');
const Company = require('./models/Company');
const CostCenter = require('./models/CostCenter');

// Connect to MongoDB
mongoose.connect('mongodb://localhost:27017/org_data', {
  useNewUrlParser: true,
  useUnifiedTopology: true
});

// Load Excel file
const workbook = xlsx.readFile(path.join(__dirname, 'organizational_data.xlsx'));
const sheet = workbook.Sheets[workbook.SheetNames[0]];
const data = xlsx.utils.sheet_to_json(sheet);

async function importData() {
  for (const [index, row] of data.entries()) {
    try {
      // ===== Validate Required Keys =====
      const sectorCode = row['Sector Code']?.toString().trim();
      const sectorName = row['Sector Name']?.trim();
      const sectorHeadId = row['Sector Head']?.toString().trim();
      const sectorHeadName = row['Sector Head Name']?.trim();

      const divisionCode = row['Division Code']?.toString().trim();
      const divisionName = row['Division Name']?.trim();
      const divisionHeadId = row['Division Head Employee ID']?.toString().trim();
      const divisionHeadName = row['Division Head Name']?.trim();

      const departmentCode = row['Department Code']?.toString().trim();
      const departmentName = row['Department Name']?.trim();

      const companyCode = row['Company Code']?.toString().trim();
      const companyName = row['Company Name']?.trim();

      const costCenterCode = row['Cost Center Code']?.toString().trim();
      const costCenterName = row['Cost Center Name']?.trim();

      if (!sectorCode || !divisionCode || !departmentCode || !companyCode || !costCenterCode) {
        console.warn(`Row ${index + 2} skipped — missing key field(s).`);
        continue;
      }

      // ===== Upsert Company =====
      const company = await Company.findOneAndUpdate(
        { companyCode },
        { companyName: companyName || 'Unknown' },
        { upsert: true, new: true }
      );

      // ===== Upsert Sector =====
      const sector = await Sector.findOneAndUpdate(
        { sectorCode },
        {
          sectorName: sectorName || 'Unknown',
          sectorHeadId: sectorHeadId || '',
          sectorHeadName: sectorHeadName || ''
        },
        { upsert: true, new: true }
      );

      // ===== Upsert Division =====
      const division = await Division.findOneAndUpdate(
        { divisionCode },
        {
          divisionName: divisionName || 'Unknown',
          divisionHeadId: divisionHeadId || '',
          divisionHeadName: divisionHeadName || '',
          sector: sector._id
        },
        { upsert: true, new: true }
      );

      // ===== Upsert Department =====
      const department = await Department.findOneAndUpdate(
        { departmentCode },
        {
          departmentName: departmentName || 'Unknown',
          division: division._id,
          sector: sector._id,
          company: company._id
        },
        { upsert: true, new: true }
      );

      // ===== Upsert Cost Center with many-to-many logic =====
      let costCenter = await CostCenter.findOne({ costCenterCode });

      if (!costCenter) {
        costCenter = await CostCenter.create({
          costCenterCode,
          costCenterName: costCenterName || 'Unknown',
          departments: [department._id],
          sectors: [sector._id]
        });
      } else {
        let updated = false;

        if (!costCenter.departments.some(dep => dep.equals(department._id))) {
          costCenter.departments.push(department._id);
          updated = true;
        }

        if (!costCenter.sectors.some(sec => sec.equals(sector._id))) {
          costCenter.sectors.push(sector._id);
          updated = true;
        }

        if (costCenterName && costCenter.costCenterName !== costCenterName) {
          costCenter.costCenterName = costCenterName;
          updated = true;
        }

        if (updated) await costCenter.save();
      }

      // ===== Link cost center to department if not linked =====
      if (!department.costCenters?.some(cc => cc.equals(costCenter._id))) {
        department.costCenters = department.costCenters || [];
        department.costCenters.push(costCenter._id);
        await department.save();
      }

      console.log(`✅ Row ${index + 2} imported.`);
    } catch (err) {
      console.error(`❌ Error in row ${index + 2}:`, err.message);
    }
  }

  console.log('🎉 Import complete.');
  mongoose.disconnect();
}

importData().catch(err => {
  console.error('💥 Fatal import error:', err);
  mongoose.disconnect();
});
