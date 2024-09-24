const fs = require('fs');
const path = require('path');
const processHtmlFields = require('../3_ConvertHTML/convertHtmlToText').processHtmlFields;
// Define the fields to extract
const fieldsToExtract = [
  'Handle',
  'Title',
  'Body (HTML)',
  'Product Category',
  'Type',
  'Tags',
  'Variant Grams',
  'Variant Inventory Qty',
  'Variant Price',
  'Image Src',
  'Image Alt Text',
  'SEO Title',
  'SEO Description',
  'Çekirdek Türü Açıklama (product.metafields.custom.cekirdek_turu_aciklama)',
  'Menşei Açıklama (product.metafields.custom.mensei_aciklama)',
  'Coffee roast (product.metafields.shopify.coffee-roast)',
  'Variant Weight Unit',
  'Status'
];



// Function to extract specified fields from the products
function extractFields(product) {
  const filteredProduct = {};
  fieldsToExtract.forEach(field => {
    if (product[field] !== undefined) {
      filteredProduct[field] = product[field];
    }
  });
  return filteredProduct;
}

// Main function to read, filter, and write data to a new JSON file (static paths)
function extractRequiredFields() {

  // Define static paths for input and output files
  const inputFilePath = path.join(__dirname, 'products.json'); // Input file
  const outputFilePath = path.join(__dirname, '../3_ConvertHTML/productsExtracted.json'); // Output file

  // Load the original data from the JSON file
  const originalData = JSON.parse(fs.readFileSync(inputFilePath, 'utf-8'));

  // Create a Set to track unique Handle values
  const uniqueHandles = new Set();

  // Filter the data to keep only the first occurrence of each Handle
  const filteredData = originalData.filter(item => {
    if (!uniqueHandles.has(item.Handle)) {
      uniqueHandles.add(item.Handle); // Add Handle to the Set if it's unique
      return true; // Keep this item
    }
    return false; // Skip duplicate
  }).map(extractFields); // Apply the extractFields transformation

  // Write the filtered data to the new JSON file
  fs.writeFileSync(outputFilePath, JSON.stringify(filteredData, null, 2), 'utf-8');

  console.log(`Filtered data saved to ../3_ConvertHTML/productsExtracted.json`);
}

setTimeout(() => {
  processHtmlFields();
}, 1000);

// Export the function for external use
module.exports = { extractRequiredFields };


