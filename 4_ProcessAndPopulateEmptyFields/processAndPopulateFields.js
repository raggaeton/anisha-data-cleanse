const fs = require('fs');
const path = require('path');

// Function to populate empty fields in the array
function populateEmptyFields(arrayWithEmptyValues, fieldOptions) {
  // Iterate through each object in the array
  arrayWithEmptyValues.forEach(item => {
    // Convert Handle to Title if Title is missing
    if (!item['Title'] && item['Handle']) {
      // Convert the Handle to Title by replacing "-" with " " and capitalizing each word
      item['Title'] = item['Handle']
        .split('-')
        .map(word => word.charAt(0).toUpperCase() + word.slice(1))
        .join(' ');
    }

    // For each field in the fieldOptions object
    for (const [field, options] of Object.entries(fieldOptions)) {
      // Check if the field exists in the current item and if it's empty or null
      if (item[field] === "" || item[field] === null || item[field] === undefined) {
        // If empty, randomly assign one of the values from the fieldOptions
        item[field] = options[Math.floor(Math.random() * options.length)];
      }
    }
  });
  
  return arrayWithEmptyValues; // Return the modified array
}


// Function to read JSON file
function readJSONFile(filePath) {
  return JSON.parse(fs.readFileSync(filePath, 'utf-8'));
}

// Function to process and populate empty fields (with static file paths)
function processAndPopulateFields() {

  // Define static file paths for the input and output files
  const arrayFilePath = path.join(__dirname, 'productsExtractedHTMLConverted.json');
  const fieldOptionsFilePath = path.join(__dirname, 'fieldOptions.json');
  const outputFilePath = path.join(__dirname, '../5_FinalData/productsFinal.json');
  
  // Read the JSON files
  const arrayWithEmptyValues = readJSONFile(arrayFilePath);
  const fieldOptions = readJSONFile(fieldOptionsFilePath);

  // Call the function to populate empty fields
  const populatedArray = populateEmptyFields(arrayWithEmptyValues, fieldOptions);

  // Save the populated array back to a new JSON file
  fs.writeFileSync(outputFilePath, JSON.stringify(populatedArray, null, 2), 'utf-8');

  console.log(`Populated array saved to ../5_FinalData/productsFinal.json with ${populatedArray.length} unqiue products`);
}

// Export the function for external use
module.exports = { processAndPopulateFields };
