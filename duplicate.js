const XLSX = require("xlsx");
const path = require("path");

// Sample data array (you can load this from DB or file)
const employees = require("./new_record_.json");

// 🟩 1. All SNI list (treated as ID number)
const allSNIList = employees.map((emp) => ({ SNI: emp.SNI }));

// 🟩 2. Find duplicates based on `firstName + employeeNumber`
const duplicateMap = new Map();

for (const emp of employees) {
  const key = `${emp.firstName}_${emp.employeeNumber}`;
  if (duplicateMap.has(key)) {
    duplicateMap.set(key, duplicateMap.get(key) + 1);
  } else {
    duplicateMap.set(key, 1);
  }
}

// Filter duplicates only
const duplicates = [];
for (const [key, count] of duplicateMap.entries()) {
  if (count > 1) {
    const [firstName, employeeNumber] = key.split("_");
    duplicates.push({ firstName, employeeNumber, duplicateCount: count });
  }
}

// 🟩 Write All SNI Excel
const allSNIWorkbook = XLSX.utils.book_new();
const sniSheet = XLSX.utils.json_to_sheet(allSNIList);
XLSX.utils.book_append_sheet(allSNIWorkbook, sniSheet, "All_IDs");
XLSX.writeFile(allSNIWorkbook, path.join(__dirname, "all_id_numbers.xlsx"));

// 🟩 Write Duplicates Excel
const duplicateWorkbook = XLSX.utils.book_new();
const duplicateSheet = XLSX.utils.json_to_sheet(duplicates);
XLSX.utils.book_append_sheet(duplicateWorkbook, duplicateSheet, "Duplicates");
XLSX.writeFile(
  duplicateWorkbook,
  path.join(__dirname, "duplicate_summary.xlsx")
);

console.log(
  "✅ Excel files generated: all_id_numbers.xlsx & duplicate_summary.xlsx"
);
