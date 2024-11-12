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

// Initialize customContinents (Empty initially, can be filled with known handle-to-continent mappings)
const customContinents = {
  "bolivar-5-kg-koli": "South America",
  "nikaragua-250g-filtre-kahve": "North America",
  "bolivar-500g-filtre-kahve": "South America",
  "african-hills-500g-filtre-kahve": "Africa",
  "kupa-hediyeli-filtre-kahve-seti": "Unknown",
  "genoa-nespresso-uyumlu-aluminyum-kapsul-kahve-5-x-10lu": "Europe",
  "genoa-nespresso-uyumlu-aluminyum-kapsul-kahve-10lu": "Europe",
  "ekonomik-paket-onikili-turk-kahvesi": "South America",
  "geleneksel-turk-kahvesi": "South America",
  "damla-sakizi-ozlu-turk-kahvesi-100er-gramlik-12li-paket": "South America",
  "damla-sakizli-3lu-turk-kahvesi-100g-x3": "South America",
  "dunya-filtre-kahveleri-5li-paket-250g-kenya-guatemala-etiyopya-brezilya-colombia": "South America",
  "brezilya-250g-filtre-kahve": "South America",
  "etiyopya-filtre-kahve-250-gram": "Africa",
  "colombia-espresso-1000-gram": "South America",
  "bolivar-espresso-1000-gram": "South America",
}

// Initialize unknownContinents to store handles where continent could not be determined
const unknownContinents = {};

// Path for unknownContinents JSON output file
const unknownContinentsPath = path.join(__dirname, './unknownContinents.json');

// Translation map for Tags field
const tagsTranslationMap = {
  "Aromalı, sakin ve yumuşak": "Flavored, calm and smooth",
  "sakin ve yumuşak": "Calm and smooth",
  "Zarif ve Aromatik": "Elegant and aromatic",
  "zengin ve güçlü": "Rich and strong"
};

// Continent map for specific countries
const continentMap = {
  "Papua New Guinea": "Oceania",
  "Honduras": "North America",
  "Panama": "North America",
  "Kenya Nyeri": "Africa",
  "Tanzania": "Africa",
  "Kenya": "Africa",
  "El Salvador": "North America",
  "Rwanda": "Africa",
  "Nicaragua": "North America",
  "Vietnam": "Asia",
  "Indonesia": "Asia",
  "Uganda": "Africa",
  "Mexico": "North America",
  "Italy": "Europe",
  "Brazil": "South America",
  "Ethiopia": "Africa"
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

  // Translate the Tags field using the tagsTranslationMap
  if (product.Tags && tagsTranslationMap[product.Tags]) {
    translatedProduct.Tags = tagsTranslationMap[product.Tags];
  } else {
    translatedProduct.Tags = product.Tags; // Keep the original Tags if not found in the map
  }

  return translatedProduct;
}

// Function to extract origin and determine the continent
function extractOriginAndContinent(product) {
  const origin = product['Menşei Açıklama (product.metafields.custom.mensei_aciklama)'];
  let continent = "Unknown"; // Default value if no match is found

  // Check if any country in the continentMap is part of the 'Menşei Açıklama' field
  for (const [country, cont] of Object.entries(continentMap)) {
    if (origin && origin.includes(country)) {
      continent = cont;
      break; // Stop searching once a match is found
    }
  }

  // If no match, check customContinents
  if (continent === "Unknown") {
    const handle = product.Handle; // Use the 'Handle' field for customContinents lookup

    // Check if customContinents has the continent based on the product's handle
    if (customContinents[handle]) {
      continent = customContinents[handle];
    } else {
      // If not found in customContinents, add to unknownContinents
      unknownContinents[handle] = "Unknown";
    }
  }

  return { origin, continent };
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

    // Extract the origin and continent information
    const { origin, continent } = extractOriginAndContinent(product);
    translatedProduct.Origin = origin;
    translatedProduct.Continent = continent;
    translatedProduct.Body = 'null'

    // Translate only the necessary fields with non-null values
    translatedProduct = await translateValues(translatedProduct);

    // Add the translated product to the metadatas array
    llmFriendlyObject.metadatas.push(translatedProduct);

    // Generate the LLM-friendly text with tasting notes from the Tags field
    const llmText = `This is a bean originated from ${translatedProduct.Origin} (${translatedProduct.Continent}). It is a ${translatedProduct.Type} type of coffee. With a price of ₺${translatedProduct.Price}, it weighs ${translatedProduct["Weight (g)"]}${translatedProduct["Weight Unit"]}. It has a ${translatedProduct.Roast} roast, and the bean is a ${translatedProduct["Bean Type"]} type of bean. This coffee offers tasting notes like ${translatedProduct.Tags}.`;

    // Add the generated text to the texts array
    llmFriendlyObject.texts.push(llmText);
  }

  // Write the final LLM-friendly object to the JSON output file
  fs.writeFileSync(outputFilePath, JSON.stringify(llmFriendlyObject, null, 2), 'utf-8');
  // After processing all products, write unknownContinents to a JSON file
fs.writeFileSync(unknownContinentsPath, JSON.stringify(unknownContinents, null, 2), 'utf-8');
  console.log(`LLM-friendly data saved to ${outputFilePath}`);
}

// Execute the function with a delay
setTimeout(() => {
  makeItLLMFriendly();
}, 2000);

// Export the function for external use
module.exports = { makeItLLMFriendly };
