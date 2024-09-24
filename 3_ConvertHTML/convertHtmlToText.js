// Import necessary modules
const fs = require('fs');
const path = require('path');
const { htmlToText } = require('html-to-text');
const processAndPopulateFields = require('../4_ProcessAndPopulateEmptyFields/processAndPopulateFields').processAndPopulateFields;
// Function to process the products and convert the "Body (HTML)" field
function processHtmlFields() {

  // File path of the original JSON file
  const filePath = path.join(__dirname, 'productsExtracted.json');

  // File path for the updated JSON file
  const updatedFilePath = path.join(__dirname, '../4_ProcessAndPopulateEmptyFields/productsExtractedHTMLConverted.json');

  // Read the JSON file
  fs.readFile(filePath, 'utf8', (err, data) => {
    if (err) {
      console.error('Error reading the file:', err);
      return;
    }

    // Parse the JSON data
    let jsonData = JSON.parse(data);

    // Check if jsonData is an array
    if (Array.isArray(jsonData)) {
      // Loop through each object in the array
      jsonData.forEach((item, index) => {
        // Check if the object has "Body (HTML)" field and it's not empty
        if (item["Body (HTML)"] && item["Body (HTML)"].trim()) {
          // Convert the HTML to plain text
          let plainText = htmlToText(item["Body (HTML)"]);

          // Remove newlines by replacing '\n' with an empty string
          plainText = plainText.replace(/\n/g, '');

          // Update the "Body (HTML)" field with the plain text (without newlines)
          item["Body (HTML)"] = plainText;

         
        } 
      });

      // Write the updated JSON array to a new file
      fs.writeFile(updatedFilePath, JSON.stringify(jsonData, null, 2), 'utf8', (err) => {
        if (err) {
          console.error('Error writing the updated file:', err);
          return;
        }
        console.log('New file successfully created with plain text content!');
      });
    } else {
      console.error('The JSON data is not an array.');
    }
  });
}

setTimeout(() => {
  processAndPopulateFields();
}, 2000);

// Export the function for external use
module.exports = { processHtmlFields };
