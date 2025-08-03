const XLSX = require("xlsx");
const path = require("path");

// Sample data
const employees = require("./data.json");

// 🟩 Step 1: Group by unique key
const grouped = new Map();

for (const emp of employees) {
  const key = `${emp.firstName}_${emp.lastName}_${emp.gender}_${emp.religion}_${emp.employeeNumber}`;
  if (!grouped.has(key)) {
    grouped.set(key, []);
  }
  grouped.get(key).push(emp);
}

// 🟩 Step 2: Separate into unique and duplicates
const uniqueEmployees = [];
const duplicateSummary = [];

for (const [key, group] of grouped.entries()) {
  if (group.length === 1) {
    uniqueEmployees.push(group[0]);
  } else {
    // Keep one for unique, rest for duplicate summary
    uniqueEmployees.push(group[0]);
    duplicateSummary.push({
      firstName: group[0].firstName,
      lastName: group[0].lastName,
      gender: group[0].gender,
      religion: group[0].religion,
      employeeNumber: group[0].employeeNumber,
      duplicateCount: group.length,
    });
  }
}

// 🟩 Step 3: Write Excel Files
// Unique Employees
const uniqueWorkbook = XLSX.utils.book_new();
const uniqueSheet = XLSX.utils.json_to_sheet(uniqueEmployees);
XLSX.utils.book_append_sheet(uniqueWorkbook, uniqueSheet, "UniqueEmployees");
XLSX.writeFile(uniqueWorkbook, path.join(__dirname, "unique_employees.xlsx"));

// Duplicates Summary
const duplicateWorkbook = XLSX.utils.book_new();
const duplicateSheet = XLSX.utils.json_to_sheet(duplicateSummary);
XLSX.utils.book_append_sheet(
  duplicateWorkbook,
  duplicateSheet,
  "DuplicateSummary"
);
XLSX.writeFile(
  duplicateWorkbook,
  path.join(__dirname, "duplicate_employees.xlsx")
);

console.log(
  "✅ Excel files generated: unique_employees.xlsx & duplicate_employees.xlsx"
);
