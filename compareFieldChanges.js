const mongoose = require('mongoose');
const xlsx = require('xlsx');
const SAPUser = require('./sap.model');

const MONGO_URI = 'mongodb://localhost:27017/sap-database';
const EXCEL_FILE = 'sap-13-aug-2025-dump.xlsx';

const fieldMap = {
  EmployeeNumber: 'employeeNumber',
  FirstName: 'firstName',
  SecondName: 'secondName',
  ThirdName: 'thirdName',
  LastName: 'lastName',
  Gender: 'gender',
  Nationality: 'nationality',
  MaritalStatus: 'maritalStatus',
  Religion: 'religion',
  BirthCountry: 'birthCountry',
  EmailAddress: 'emailAddress',
  PhoneNumber: 'phoneNumber',
  Sector: 'sector',
  SectorCode: 'sectorCode',
  'Division Head': 'divisionHead',
  Division: 'division',
  DivisionCode: 'divisionCode',
  Department: 'department',
  DepartmentCode: 'departmentCode',
  CostCentreAccount: 'costCentreAccount',
  CostCentreAccountCode: 'costCentreAccountCode',
  ContractType: 'contractType',
  ManagerID: 'managerID',
  ManagerName: 'managerName',
  ManagerEmail: 'managerEmail',
  EmployeeStatus: 'employeeStatus',
  JobTitle: 'jobTitle',
  EmployeeHireDate: 'employeeHireDate',
  SNI: 'sNI',
  'Iqama Number': 'iqamaNumber',
  Passport: 'passport',
  'Iqama Expiry Date': 'iqamaExpiryDate',
  'Company (externalCode)': 'companyExternalCode',
  'Company (Label)': 'companyLabel',
  'Contract End Date': 'contractEndDate',
  'Contract Period (Picklist Label)': 'contractPeriodPicklistLabel',
  'Probation Period (Picklist Label)': 'probationPeriodPicklistLabel',
  'Standard Weekly Hours': 'standardWeeklyHours',
  'Location Group (Name)': 'locationGroupName',
  'Work Location (Name)': 'workLocationName',
  'Position Name': 'positionName',
  'Present Address': 'presentAddress',
  'Last Working Day': 'lastWorkingDay',
  'Leaving Reason (Picklist Label)': 'leavingReasonPicklistLabel',
  'Leaving Reason': 'leavingReason',
  'Sector Head': 'sectorHead',
  'Sector Head First Name': 'sectorHeadFirstName',
  'Sector Head Last Name': 'sectorHeadLastName',
  'Sector Head Email': 'sectorHeadEmail'
};

function normalize(val) {
  return typeof val === 'string' ? val.trim().toLowerCase() : (val?.toString().trim().toLowerCase() ?? '');
}

async function connectToMongo() {
  await mongoose.connect(MONGO_URI);
  console.log('✅ Connected to MongoDB');
}

function readExcelData(path) {
  const wb = xlsx.readFile(path);
  const sheet = wb.Sheets[wb.SheetNames[0]];
  return xlsx.utils.sheet_to_json(sheet);
}

async function analyzeFieldChanges(excelData) {
  const fieldStats = {};
  for (const [excelKey, mongoKey] of Object.entries(fieldMap)) {
    fieldStats[mongoKey] = {
      field: excelKey,
      compared: 0,
      changed: 0
    };
  }

  for (const row of excelData) {
    const empNo = normalize(row.EmployeeNumber);
    if (!empNo) continue;

    const dbUser = await SAPUser.findOne({ employeeNumber: empNo }).lean();
    if (!dbUser) continue;

    for (const [excelKey, mongoKey] of Object.entries(fieldMap)) {
      const newVal = normalize(row[excelKey]);
      const oldVal = normalize(dbUser[mongoKey]);

      if (!newVal || !oldVal) continue;

      fieldStats[mongoKey].compared++;
      if (newVal !== oldVal) {
        fieldStats[mongoKey].changed++;
      }
    }
  }

  const tableData = Object.entries(fieldStats).map(([key, stat]) => {
    const percent =
      stat.compared === 0 ? '0.00%' : ((stat.changed / stat.compared) * 100).toFixed(2) + '%';
    return {
      Field: stat.field,
      'Change %': percent,
      Compared: stat.compared,
      Changed: stat.changed
    };
  });

  console.log('\n📊 Accurate Field Change Analysis:\n');
  console.table(tableData);
}

async function run() {
  await connectToMongo();
  const excelData = readExcelData(EXCEL_FILE);
  await analyzeFieldChanges(excelData);
  mongoose.disconnect();
}

run();
