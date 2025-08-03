const XLSX = require("xlsx");
const fs = require("fs");
const path = require("path");

// Your JSON object
const data = require("./data.json");

// Wrap it in an array
const dataArray = data;

// Convert to worksheet
const worksheet = XLSX.utils.json_to_sheet(dataArray);

// Create workbook
const workbook = XLSX.utils.book_new();
XLSX.utils.book_append_sheet(workbook, worksheet, "EmployeeData");

// Write to file
const filePath = path.join(__dirname, "employee_data.xlsx");
XLSX.writeFile(workbook, filePath);

console.log(`✅ Excel file created at: ${filePath}`);
