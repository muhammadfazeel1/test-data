const XLSX = require('xlsx');
const path = require('path');
const fs = require('fs');

// 🟦 Path to your Excel file
const filePath = path.join(__dirname, './Copy.xlsx');

// 🟨 Read the workbook
const workbook = XLSX.readFile(filePath);

// 🟩 Get the first sheet name
const sheetName = workbook.SheetNames[0];

// 🟦 Convert sheet to JSON
const worksheet = workbook.Sheets[sheetName];
const jsonData = XLSX.utils.sheet_to_json(worksheet);

// 🟫 Print or save to a .json file
console.log(jsonData);

// Optional: Save to file
fs.writeFileSync(path.join(__dirname, 'new_record_.json'), JSON.stringify(jsonData, null, 2));

console.log('✅ Excel converted to JSON and saved as output.json');
