const fs = require("fs");
const path = require("path");

const array1 = require("./output_split_names.json"); // From Excel or system
const array2 = require("./new_record_.json"); // From other source

// Normalize for comparison
function normalize(rec) {
  return {
    // firstName: String(rec.FirstName || rec.firstName || "").toLowerCase(),
    lastName: String(rec.fourthName || rec.LastName || "").toLowerCase(),
    // iqamaNumber: String(
    //   rec["Iqama Number"] || rec.iqamaNumber || ""
    // ).toLowerCase(),
    // passport: String(
    //   rec["Passport Number"] || rec.passportNo || ""
    // ).toLowerCase(),
    // gender: String(rec["Gender"] || rec.gender || "").toLowerCase(),
    // nationality: String(
    //   rec["Nationality"] || rec.nationality || ""
    // ).toLowerCase(),
  };
}

// Convert to normalized sets
const normalized1 = array1.map(normalize);
const normalized2 = array2.map(normalize);

// Helper to compare two records
function isSame(a, b) {
  return (
    // a.firstName === b.firstName &&
    a.lastName === b.lastName // &&
    // a.iqamaNumber === b.iqamaNumber && a.passport === b.passport &&
    // a.gender === b.gender &&
    // a.nationality === b.nationality
  );
}

// 1️⃣ Find matches and unmatched from array1
let matchedCount = 0;
const unmatchedFrom1 = [];

for (const rec1 of normalized1) {
  const found = normalized2.find((rec2) => isSame(rec1, rec2));
  if (found) {
    matchedCount++;
  } else {
    unmatchedFrom1.push(rec1);
  }
}

// 2️⃣ Find unmatched from array2
const unmatchedFrom2 = [];

for (const rec2 of normalized2) {
  const found = normalized1.find((rec1) => isSame(rec1, rec2));
  if (!found) {
    unmatchedFrom2.push(rec2);
  }
}

// 🔢 Output summary
console.log("🔢 Total Records in Muqeem Sheet:", normalized1.length);
console.log("🔢 Total Records in SAP Sheet:", normalized2.length);
console.log("✅ Matching Records Count:", matchedCount);
console.log("❌ Unmatched from Muqeem:", unmatchedFrom1.length);
console.log("❌ Unmatched from SAP:", unmatchedFrom2.length);

// Optional: Save unmatched to files
/*
const fs = require('fs');
fs.writeFileSync('./unmatched_from_array1.json', JSON.stringify(unmatchedFrom1, null, 2));
fs.writeFileSync('./unmatched_from_array2.json', JSON.stringify(unmatchedFrom2, null, 2));
*/
