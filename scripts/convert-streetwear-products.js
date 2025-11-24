const fs = require('fs');
const path = require('path');

// Read the file
const filePath = path.join(__dirname, '../data/streetwear/products.ts');
let content = fs.readFileSync(filePath, 'utf8');

// Replace field patterns
content = content.replace(/name: "([^"]+)"/g, (match, name) => {
  // Simple translation mapping for common words
  const translations = {
    'Oversized Black Tee': 'เสื้อยืดโอเวอร์ไซส์สีดำ',
    'Vintage Graphic Tee': 'เสื้อยืดกราฟิกวินเทจ',
    'Striped Long Sleeve': 'เสื้อแขนยาวลายทาง',
    'T-Shirts & Tops': 'เสื้อยืดและเสื้อท็อป',
    'Hoodies & Sweatshirts': 'เสื้อฮู้ดและสเวตเตอร์',
    'Pants & Bottoms': 'กางเกงและกางเกงขาสั้น',
    'Outerwear': 'เสื้อนอก',
    'Accessories': 'เครื่องประดับ'
  };

  const thaiName = translations[name] || name;
  return `name_th: "${thaiName}",\n    name_en: "${name}"`;
});

content = content.replace(/description: "([^"]+)"/g, (match, desc) => {
  // Keep same description for both languages for now
  return `description_th: "${desc}",\n    description_en: "${desc}"`;
});

content = content.replace(/category: "([^"]+)"/g, (match, cat) => {
  const translations = {
    'T-Shirts & Tops': 'เสื้อยืดและเสื้อท็อป',
    'Hoodies & Sweatshirts': 'เสื้อฮู้ดและสเวตเตอร์',
    'Pants & Bottoms': 'กางเกงและกางเกงขาสั้น',
    'Outerwear': 'เสื้อนอก',
    'Accessories': 'เครื่องประดับ'
  };

  const thaiCat = translations[cat] || cat;
  return `category_th: "${thaiCat}",\n    category_en: "${cat}"`;
});

// Write back
fs.writeFileSync(filePath, content, 'utf8');
console.log('✅ Successfully converted streetwear products to multi-language format');
