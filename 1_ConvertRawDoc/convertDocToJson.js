const xlsx = require('xlsx');
const fs = require('fs');
const path = require('path');
const extractFields = require('../2_ExtractRequiredFields/extractRequiredFields').extractRequiredFields;
// Define the path to your .xlsx file
const xlsxFilePath = path.join(__dirname, 'products_export_1.xlsx');

// Read the Excel file
const workbook = xlsx.readFile(xlsxFilePath);

// Assuming the first sheet (you can modify the sheet name if needed)
const sheetName = workbook.SheetNames[0];

// Convert the first sheet to JSON
const jsonData = xlsx.utils.sheet_to_json(workbook.Sheets[sheetName], {
    defval: "" // Sets empty fields to an empty string
});

// Define the path for the JSON output file
const jsonFilePath = path.join(__dirname, '../2_ExtractRequiredFields/products.json');

// Write the JSON data to a file
fs.writeFile(jsonFilePath, JSON.stringify(jsonData, null, 2), 'utf8', (err) => {
    if (err) {
        console.error('Error writing JSON file:', err);
        return;
    }
    console.log('Excel file successfully converted to JSON!');
});

setTimeout(() => {
    extractFields();
}, 500);