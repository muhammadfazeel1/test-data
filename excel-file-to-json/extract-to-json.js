const XLSX = require('xlsx');
const fs = require('fs');

// Path to your .xlsx file
const filePath = './jobsar.xlsx';

// Read the workbook
const workbook = XLSX.readFile(filePath);

// Convert the first sheet to JSON
const firstSheetName = workbook.SheetNames[0];
const firstSheet = workbook.Sheets[firstSheetName];
const jsonData = XLSX.utils.sheet_to_json(firstSheet);

// Define the output JSON file path
const outputPath = './output-1.json';

// Write the JSON data to a file
fs.writeFile(outputPath, JSON.stringify(jsonData, null, 2), (err) => {
    if (err) {
        console.error('Error writing JSON file:', err);
    } else {
        console.log('JSON file has been saved successfully.');
    }
});
~