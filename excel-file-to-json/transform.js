// Function to transform the array
const data = require('./output-1.json')
const fs = require('fs');

const transformData = (res) => {
    return res.map(item => {
      // Use regex to extract the number inside the parentheses
      // const match = item.value.match(/\((\d+)\)/);
  
      // if (match) {
        // const extractedNumber = match[1];  // Extract the number from the match
        return {
          label: item.__EMPTY_1,      // Original value as label
          labelAr: item.__EMPTY_1,    // Original value as labelAr
          value: item.__EMPTY  // The extracted number from the parentheses
        };
      // }
      // return null; // Handle cases where no number is found
    }).filter(item => item !== null); // Filter out any nulls (in case no number was found)
  };
  
  // Call the function
// Call the function
const transformedData = transformData(data);
// Write the JSON data to a file
fs.writeFile('./trans-1.json', JSON.stringify(transformedData, null, 2), (err) => {
    if (err) {
        console.error('Error writing JSON file:', err);
    } else {
        console.log('JSON file has been saved successfully.');
    }
});