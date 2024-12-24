const XLSX = require('xlsx');
const fs = require('fs');

// Function to read Excel file and convert to JSON array
function readExcelFileToJson(filePath) {
    // Read the Excel file
    const workbook = XLSX.readFile(filePath);

    // Get the first sheet name
    const sheetName = workbook.SheetNames[0];

    // Get data from the first sheet
    const worksheet = workbook.Sheets[sheetName];

    // Convert sheet to JSON
    const jsonData = XLSX.utils.sheet_to_json(worksheet);

    return jsonData;
}

// Usage
const filePath = './test.xlsx'; // Replace with your actual file path
const jsonArray = readExcelFileToJson(filePath);

// Output the JSON array
console.log(jsonArray);
