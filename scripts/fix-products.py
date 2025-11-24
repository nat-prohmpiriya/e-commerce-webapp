#!/usr/bin/env python3
import re

# Read the file
with open('data/streetwear/products.ts', 'r', encoding='utf-8') as f:
    content = f.read()

# Translation mappings
name_translations = {
    'Oversized Black Tee': 'เสื้อยืดโอเวอร์ไซส์สีดำ',
    'Vintage Graphic Tee': 'เสื้อยืดกราฟิกวินเทจ',
    'Striped Long Sleeve': 'เสื้อแขนยาวลายทาง',
}

category_translations = {
    'T-Shirts & Tops': 'เสื้อยืดและเสื้อท็อป',
    'Hoodies & Sweatshirts': 'เสื้อฮู้ดและสเวตเตอร์',
    'Pants & Bottoms': 'กางเกงและกางเกงขาสั้น',
    'Outerwear': 'เสื้อนอก',
    'Accessories': 'เครื่องประดับ'
}

# Split into products
products = content.split('  {')
result = [products[0]]  # Keep the header

for product in products[1:]:
    # Replace name field (not in colors array)
    def replace_name(match):
        indent = match.group(1)
        name = match.group(2)
        thai_name = name  # Default to same name
        # Try to get translation, fallback to English
        for en, th in name_translations.items():
            if en in name:
                thai_name = th
                break
        return f'{indent}name_th: "{thai_name}",\n{indent}name_en: "{name}"'

    # Only replace name at the start of a line (not in colors)
    product = re.sub(r'^(\s+)name: "([^"]+)"', replace_name, product, flags=re.MULTILINE)

    # Replace description
    def replace_desc(match):
        indent = match.group(1)
        desc = match.group(2)
        # Keep same for both
        return f'{indent}description_th: "{desc}",\n{indent}description_en: "{desc}"'

    product = re.sub(r'^(\s+)description: "([^"]+)"', replace_desc, product, flags=re.MULTILINE)

    # Replace category
    def replace_cat(match):
        indent = match.group(1)
        cat = match.group(2)
        thai_cat = category_translations.get(cat, cat)
        return f'{indent}category_th: "{thai_cat}",\n{indent}category_en: "{cat}"'

    product = re.sub(r'^(\s+)category: "([^"]+)"', replace_cat, product, flags=re.MULTILINE)

    result.append('  {' + product)

# Join back
content = ''.join(result)

# Write back
with open('data/streetwear/products.ts', 'w', encoding='utf-8') as f:
    f.write(content)

print('✅ Successfully fixed streetwear products')
