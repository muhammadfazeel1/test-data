const PizZip = require("pizzip");
const Docxtemplater = require("docxtemplater");
const fs = require("fs");
const path = require("path");

// Load the DOCX template
const content = fs.readFileSync(path.resolve(__dirname, "table.docx"), "binary");

// Initialize PizZip with the binary content
const zip = new PizZip(content);

// Initialize Docxtemplater with the zip instance
const doc = new Docxtemplater(zip, {
  paragraphLoop: true, // Enables loops for paragraphs
  linebreaks: true, // Enable line breaks in text content
});

// Example dynamic data for the table
const data = {
  table: [
    { name: "John", age: 30, city: "New York" },
    { name: "Anna", age: 22, city: "London" },
    { name: "Mike", age: 25, city: "Sydney" },
  ],
};

// Set the dynamic data into the template
doc.render(data);

// Generate the DOCX file
const buffer = doc.getZip().generate({ type: "nodebuffer" });

// Save the generated file
fs.writeFileSync(path.resolve(__dirname, "output.docx"), buffer);

console.log("DOCX file created successfully!");
