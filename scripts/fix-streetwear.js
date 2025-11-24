const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, '../data/streetwear/products.ts');
let content = fs.readFileSync(filePath, 'utf8');

// Fix name fields - but not in colors objects
// Split by product boundaries
const lines = content.split('\n');
const result = [];
let inColorsArray = false;

for (let i = 0; i < lines.length; i++) {
  let line = lines[i];

  // Track if we're in colors array
  if (line.includes('colors: [')) {
    inColorsArray = true;
  }
  if (inColorsArray && line.includes('],')) {
    inColorsArray = false;
  }

  // Only replace if NOT in colors array
  if (!inColorsArray) {
    // Replace product name field
    if (line.match(/^\s+name: "/)) {
      line = line.replace(/name: "([^"]+)"/, 'name_th: "$1",\n    name_en: "$1"');
    }

    // Replace description field
    if (line.match(/^\s+description: "/)) {
      line = line.replace(/description: "([^"]+)"/, 'description_th: "$1",\n    description_en: "$1"');
    }

    // Replace category fields with translations
    if (line.includes('category: "T-Shirts & Tops"')) {
      line = line.replace('category: "T-Shirts & Tops"', 'category_th: "เสื้อยืดและเสื้อท็อป",\n    category_en: "T-Shirts & Tops"');
    }
    if (line.includes('category: "Hoodies & Sweatshirts"')) {
      line = line.replace('category: "Hoodies & Sweatshirts"', 'category_th: "เสื้อฮู้ดและสเวตเตอร์",\n    category_en: "Hoodies & Sweatshirts"');
    }
    if (line.includes('category: "Pants & Bottoms"')) {
      line = line.replace('category: "Pants & Bottoms"', 'category_th: "กางเกงและกางเกงขาสั้น",\n    category_en: "Pants & Bottoms"');
    }
    if (line.includes('category: "Outerwear"')) {
      line = line.replace('category: "Outerwear"', 'category_th: "เสื้อนอก",\n    category_en: "Outerwear"');
    }
    if (line.includes('category: "Accessories"')) {
      line = line.replace('category: "Accessories"', 'category_th: "เครื่องประดับ",\n    category_en: "Accessories"');
    }
  }

  result.push(line);
}

content = result.join('\n');

// Write back
fs.writeFileSync(filePath, content, 'utf8');
console.log('✅ Successfully converted streetwear products');
