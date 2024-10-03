const fs = require('fs');
const path = require('path');
const translate = require('translate-google');

// Paths for input and output files
const productsFinalPath = path.join(__dirname, 'productsFinal.json');
const outputFilePath = path.join(__dirname, '../6_LLM_Friendly/LLMFriendlyData.json');

// Translation map for keys
const translationMap = {
  "Handle": "Handle",
  "Title": "Title",
  "Body (HTML)": "Body",
  "Product Category": "Product Category",
  "Type": "Type",
  "Tags": "Tags",
  "Variant Grams": "Weight (g)",
  "Variant Inventory Qty": "Inventory",
  "Variant Price": "Price",
  "Image Src": "Image URL",
  "Image Alt Text": "Alt Text",
  "SEO Title": "SEO Title",
  "SEO Description": "SEO Description",
  "Çekirdek Türü Açıklama (product.metafields.custom.cekirdek_turu_aciklama)": "Bean Type",
  "Menşei Açıklama (product.metafields.custom.mensei_aciklama)": "Origin",
  "Coffee roast (product.metafields.shopify.coffee-roast)": "Roast",
  "Variant Weight Unit": "Weight Unit",
  "Status": "Status"
};

// Function to translate keys using the translation map
function translateKeys(product, translationMap) {
  const translatedProduct = {};
  for (const [key, value] of Object.entries(product)) {
    if (translationMap[key]) {
      translatedProduct[translationMap[key]] = value;
    } else {
      translatedProduct[key] = value; // Keep the original key if not in map
    }
  }
  return translatedProduct;
}

// Function to translate only the required fields and skip null or non-string values
async function translateValues(product) {
  const translatedProduct = { ...product };
  
  // Fields used in the LLM text
  const fieldsToTranslate = ['Title', 'Origin', 'Type', 'Roast', 'Bean Type'];

  for (const key of fieldsToTranslate) {
    // Check for non-null values and ensure the value is a string before translating
    if (product[key] && typeof product[key] === 'string') {
      try {
        translatedProduct[key] = await translate(product[key], { from: 'tr', to: 'en' });
      } catch (error) {
        console.error(`Error translating key "${key}" with value "${product[key]}":`, error);
        translatedProduct[key] = product[key]; // Fallback to the original value in case of an error
      }
    }
  }

  return translatedProduct;
}

// Main function to process the products, translate keys, and then translate values
async function makeItLLMFriendly() {
  // Read the productsFinal JSON file
  const productsData = JSON.parse(fs.readFileSync(productsFinalPath, 'utf-8'));

  // Initialize the final LLM-friendly object
  const llmFriendlyObject = {
    name: "anisha",
    texts: [],
    metadatas: []
  };

  // Process each product: First translate keys, then translate values, then create LLM-friendly text
  for (let product of productsData) {
    // Translate the keys first
    let translatedProduct = translateKeys(product, translationMap);

    // Translate only the necessary fields with non-null values
    translatedProduct = await translateValues(translatedProduct);

    // Add the translated product to the metadatas array
    llmFriendlyObject.metadatas.push(translatedProduct);

    // Generate the LLM-friendly text
    const llmText = `${translatedProduct.Title} is a bean originated from ${translatedProduct.Origin}. It is a ${translatedProduct.Type} type of coffee. With a price of ₺${translatedProduct.Price} it weighs ${translatedProduct["Weight (g)"]}${translatedProduct["Weight Unit"]}. It has a ${translatedProduct.Roast} roast. And the bean is a ${translatedProduct["Bean Type"]} type of bean.`;

    // Add the generated text to the texts array
    llmFriendlyObject.texts.push(llmText);
  }

  // Write the final LLM-friendly object to the JSON output file
  fs.writeFileSync(outputFilePath, JSON.stringify(llmFriendlyObject, null, 2), 'utf-8');
  
  console.log(`LLM-friendly data saved to ${outputFilePath}`);
}

// Execute the function with a delay
setTimeout(() => {
  makeItLLMFriendly();
}, 2000);

// Export the function for external use
module.exports = { makeItLLMFriendly };
