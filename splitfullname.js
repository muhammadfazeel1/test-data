const fs = require("fs");

// Load your JSON data (replace 'input.json' with your actual file path if reading from file)
const data = require("./muqeem.json");

// Helper: clean name parts
const cleanNameParts = (name) =>
  name
    .trim()
    .split(/\s+/)
    .filter(
      (part) => part !== "-" && part !== "–" && part !== "—" && part !== "•"
    );

// Transform and split name
const updatedData = data.map((entry) => {
  const parts = cleanNameParts(entry.Name);
  return {
    ...entry,
    firstName: parts[0] || "",
    secondName: parts[1] || "",
    thirdName: parts[2] || "",
    fourthName: parts.slice(3).join(" ") || "",
  };
});

// Write to file
fs.writeFileSync(
  "output_split_names.json",
  JSON.stringify(updatedData, null, 2),
  "utf-8"
);

console.log("✔ output_split_names.json has been created.");
