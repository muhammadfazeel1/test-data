/**
 * mergeByCode.js
 *
 * Expectation:
 *   ./one.js   →   module.exports = [ { code: 'A1', … }, … ];
 *   ./two.js   →   module.exports = [ { code: 'B3', … }, … ];
 *
 * Run:
 *   node mergeByCode.js
 */

const fs = require("fs");
const path = require("path");

// ---------------------------------------------------------------------------
// 1️⃣  Load the arrays --------------------------------------------------------
const { one } = require("./1.js"); // 👈 make sure one.js exports an array
const { two } = require("./2.js"); // 👈 make sure two.js exports an array
const arrA = one;
const arrB = two;
if (!Array.isArray(arrA) || !Array.isArray(arrB)) {
  console.error("❌  Both modules must export an array of objects.");
  process.exit(1);
}

// ---------------------------------------------------------------------------
// 2️⃣  Merge on `code` ---------------------------------------------------------
const map = new Map();

// baseline from first array (keeps order)
for (const obj of arrA) {
  if (!obj || typeof obj.code === "undefined") continue;
  map.set(obj.code, obj);
}

// add brand-new codes from second array
for (const obj of arrB) {
  if (!obj || typeof obj.code === "undefined") continue;
  if (!map.has(obj.code)) map.set(obj.code, obj);

  // ▸ If you want B to override A when code clashes, swap the line above for:
  // map.set(obj.code, { ...map.get(obj.code), ...obj });
}

// ---------------------------------------------------------------------------
// 3️⃣  Write the result --------------------------------------------------------
const merged = Array.from(map.values());
fs.writeFileSync(
  path.resolve(__dirname, "combined.json"),
  JSON.stringify(merged, null, 2)
);

console.log(`✅  combined.json created with ${merged.length} unique objects`);
