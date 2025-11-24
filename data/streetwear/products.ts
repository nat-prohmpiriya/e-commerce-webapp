import { Product } from "@/types";
import { Timestamp } from "firebase/firestore";

const streetwearProducts: Product[] = [
  // T-SHIRTS & TOPS
  {
    id: "sw-001",
    name_th: "Oversized Black Tee",
    name_en: "Oversized Black Tee",
    description_th: "Premium heavyweight cotton tee with an oversized fit. Perfect for layering or wearing solo. Features reinforced neckline and double-stitched sleeves for durability.",
    description_en: "Premium heavyweight cotton tee with an oversized fit. Perfect for layering or wearing solo. Features reinforced neckline and double-stitched sleeves for durability.",
    category_th: "เสื้อยืดและเสื้อท็อป",
    category_en: "T-Shirts & Tops",
    price: 890,
    salePrice: undefined,
    images: [
      "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=800",
      "https://images.unsplash.com/photo-1583743814966-8936f5b7be1a?w=800"
    ],
    sizes: ["S", "M", "L", "XL", "XXL"],
    colors: [
      { name: "Black", hex: "#000000" },
      { name: "White", hex: "#FFFFFF" },
      { name: "Gray", hex: "#808080" }
    ],
    rating: 4.8,
    reviewCount: 234,
    stock: 150,
    isPublished: true,
    createdAt: Timestamp.now(),
    updatedAt: Timestamp.now()
  },
  {
    id: "sw-002",
    name_th: "Vintage Graphic Tee",
    name_en: "Vintage Graphic Tee",
    description_th: "Retro-inspired graphic tee with vintage wash. Unique print design that captures the essence of 90s streetwear culture.",
    description_en: "Retro-inspired graphic tee with vintage wash. Unique print design that captures the essence of 90s streetwear culture.",
    category_th: "เสื้อยืดและเสื้อท็อป",
    category_en: "T-Shirts & Tops",
    price: 1290,
    salePrice: 990,
    images: [
      "https://images.unsplash.com/photo-1618354691373-d851c5c3a990?w=800",
      "https://images.unsplash.com/photo-1576566588028-4147f3842f27?w=800"
    ],
    sizes: ["S", "M", "L", "XL"],
    colors: [
      { name: "Vintage White", hex: "#F8F8F0" },
      { name: "Faded Black", hex: "#2B2B2B" },
      { name: "Navy", hex: "#1A1A2E" }
    ],
    rating: 4.7,
    reviewCount: 189,
    stock: 85,
    isPublished: true,
    createdAt: Timestamp.now(),
    updatedAt: Timestamp.now()
  },
  {
    id: "sw-003",
    name_th: "Minimalist Long Sleeve Tee",
    name_en: "Minimalist Long Sleeve Tee",
    description_th: "Clean and minimal long sleeve tee made from organic cotton. Comfortable fit for all-day wear with subtle branding.",
    description_en: "Clean and minimal long sleeve tee made from organic cotton. Comfortable fit for all-day wear with subtle branding.",
    category_th: "เสื้อยืดและเสื้อท็อป",
    category_en: "T-Shirts & Tops",
    price: 1190,
    salePrice: undefined,
    images: [
      "https://images.unsplash.com/photo-1620799140188-3b2a02fd9a77?w=800"
    ],
    sizes: ["S", "M", "L", "XL", "XXL"],
    colors: [
      { name: "Cream", hex: "#FFFDD0" },
      { name: "Sage Green", hex: "#9DC183" },
      { name: "Charcoal", hex: "#36454F" }
    ],
    rating: 4.9,
    reviewCount: 312,
    stock: 120,
    isPublished: true,
    createdAt: Timestamp.now(),
    updatedAt: Timestamp.now()
  },
  {
    id: "sw-004",
    name_th: "Striped Polo Shirt",
    name_en: "Striped Polo Shirt",
    description_th: "Classic polo with modern streetwear twist. Premium pique cotton with contrast stripes and embroidered logo.",
    description_en: "Classic polo with modern streetwear twist. Premium pique cotton with contrast stripes and embroidered logo.",
    category_th: "เสื้อยืดและเสื้อท็อป",
    category_en: "T-Shirts & Tops",
    price: 1590,
    salePrice: undefined,
    images: [
      "https://images.unsplash.com/photo-1586790170083-2f9ceadc732d?w=800"
    ],
    sizes: ["M", "L", "XL"],
    colors: [
      { name: "Navy/White", hex: "#000080" },
      { name: "Black/Gray", hex: "#000000" }
    ],
    rating: 4.6,
    reviewCount: 98,
    stock: 60,
    isPublished: true,
    createdAt: Timestamp.now(),
    updatedAt: Timestamp.now()
  },

  // HOODIES & SWEATSHIRTS
  {
    id: "sw-005",
    name_th: "Classic Pullover Hoodie",
    name_en: "Classic Pullover Hoodie",
    description_th: "Essential heavyweight hoodie with adjustable drawstrings. Premium fleece lining for maximum comfort and warmth.",
    description_en: "Essential heavyweight hoodie with adjustable drawstrings. Premium fleece lining for maximum comfort and warmth.",
    category_th: "เสื้อฮู้ดและสเวตเตอร์",
    category_en: "Hoodies & Sweatshirts",
    price: 2290,
    salePrice: 1890,
    images: [
      "https://images.unsplash.com/photo-1556821840-3a63f95609a7?w=800",
      "https://images.unsplash.com/photo-1620799140408-edc6dcb6d633?w=800"
    ],
    sizes: ["S", "M", "L", "XL", "XXL"],
    colors: [
      { name: "Black", hex: "#000000" },
      { name: "Gray", hex: "#808080" },
      { name: "Navy", hex: "#000080" },
      { name: "Brown", hex: "#654321" }
    ],
    rating: 4.9,
    reviewCount: 567,
    stock: 200,
    isPublished: true,
    createdAt: Timestamp.now(),
    updatedAt: Timestamp.now()
  },
  {
    id: "sw-006",
    name_th: "Vintage Washed Hoodie",
    name_en: "Vintage Washed Hoodie",
    description_th: "Oversized hoodie with vintage wash treatment. Unique faded effect makes each piece one-of-a-kind.",
    description_en: "Oversized hoodie with vintage wash treatment. Unique faded effect makes each piece one-of-a-kind.",
    category_th: "เสื้อฮู้ดและสเวตเตอร์",
    category_en: "Hoodies & Sweatshirts",
    price: 2590,
    salePrice: undefined,
    images: [
      "https://images.unsplash.com/photo-1578587018452-892bacefd3f2?w=800"
    ],
    sizes: ["M", "L", "XL", "XXL"],
    colors: [
      { name: "Faded Olive", hex: "#556B2F" },
      { name: "Vintage Brown", hex: "#8B4513" },
      { name: "Washed Black", hex: "#2F2F2F" }
    ],
    rating: 4.8,
    reviewCount: 423,
    stock: 95,
    isPublished: true,
    createdAt: Timestamp.now(),
    updatedAt: Timestamp.now()
  },
  {
    id: "sw-007",
    name_th: "Zip-Up Tech Hoodie",
    name_en: "Zip-Up Tech Hoodie",
    description_th: "Modern tech hoodie with full zip closure. Features water-resistant fabric and multiple utility pockets.",
    description_en: "Modern tech hoodie with full zip closure. Features water-resistant fabric and multiple utility pockets.",
    category_th: "เสื้อฮู้ดและสเวตเตอร์",
    category_en: "Hoodies & Sweatshirts",
    price: 2890,
    salePrice: undefined,
    images: [
      "https://images.unsplash.com/photo-1591047139829-d91aecb6caea?w=800"
    ],
    sizes: ["S", "M", "L", "XL"],
    colors: [
      { name: "Black", hex: "#000000" },
      { name: "Charcoal", hex: "#36454F" }
    ],
    rating: 4.7,
    reviewCount: 201,
    stock: 75,
    isPublished: true,
    createdAt: Timestamp.now(),
    updatedAt: Timestamp.now()
  },
  {
    id: "sw-008",
    name_th: "Crewneck Sweatshirt",
    name_en: "Crewneck Sweatshirt",
    description_th: "Classic crewneck with embroidered logo. Soft cotton blend fleece with ribbed cuffs and hem.",
    description_en: "Classic crewneck with embroidered logo. Soft cotton blend fleece with ribbed cuffs and hem.",
    category_th: "เสื้อฮู้ดและสเวตเตอร์",
    category_en: "Hoodies & Sweatshirts",
    price: 1990,
    salePrice: 1590,
    images: [
      "https://images.unsplash.com/photo-1614963366795-f2145c0b0dbf?w=800"
    ],
    sizes: ["S", "M", "L", "XL", "XXL"],
    colors: [
      { name: "Beige", hex: "#F5F5DC" },
      { name: "Forest Green", hex: "#228B22" },
      { name: "Burgundy", hex: "#800020" }
    ],
    rating: 4.8,
    reviewCount: 289,
    stock: 140,
    isPublished: true,
    createdAt: Timestamp.now(),
    updatedAt: Timestamp.now()
  },

  // PANTS & BOTTOMS
  {
    id: "sw-009",
    name_th: "Cargo Utility Pants",
    name_en: "Cargo Utility Pants",
    description_th: "Multi-pocket cargo pants with adjustable waist. Durable ripstop fabric perfect for urban exploration.",
    description_en: "Multi-pocket cargo pants with adjustable waist. Durable ripstop fabric perfect for urban exploration.",
    category_th: "กางเกงและกางเกงขาสั้น",
    category_en: "Pants & Bottoms",
    price: 2190,
    salePrice: undefined,
    images: [
      "https://images.unsplash.com/photo-1624378439575-d8705ad7ae80?w=800",
      "https://images.unsplash.com/photo-1594633313593-bab3825d0caf?w=800"
    ],
    sizes: ["28", "30", "32", "34", "36"],
    colors: [
      { name: "Black", hex: "#000000" },
      { name: "Khaki", hex: "#C3B091" },
      { name: "Olive", hex: "#556B2F" }
    ],
    rating: 4.9,
    reviewCount: 445,
    stock: 180,
    isPublished: true,
    createdAt: Timestamp.now(),
    updatedAt: Timestamp.now()
  },
  {
    id: "sw-010",
    name_th: "Straight Fit Jeans",
    name_en: "Straight Fit Jeans",
    description_th: "Classic straight fit jeans in premium denim. Comfortable mid-rise with traditional 5-pocket styling.",
    description_en: "Classic straight fit jeans in premium denim. Comfortable mid-rise with traditional 5-pocket styling.",
    category_th: "กางเกงและกางเกงขาสั้น",
    category_en: "Pants & Bottoms",
    price: 2490,
    salePrice: 1990,
    images: [
      "https://images.unsplash.com/photo-1542272604-787c3835535d?w=800"
    ],
    sizes: ["28", "30", "32", "34", "36", "38"],
    colors: [
      { name: "Dark Indigo", hex: "#1A1A40" },
      { name: "Black", hex: "#000000" },
      { name: "Light Wash", hex: "#6495ED" }
    ],
    rating: 4.7,
    reviewCount: 678,
    stock: 220,
    isPublished: true,
    createdAt: Timestamp.now(),
    updatedAt: Timestamp.now()
  },
  {
    id: "sw-011",
    name_th: "Tapered Joggers",
    name_en: "Tapered Joggers",
    description_th: "Comfortable joggers with tapered fit. Elastic waistband with drawstring and zippered ankle cuffs.",
    description_en: "Comfortable joggers with tapered fit. Elastic waistband with drawstring and zippered ankle cuffs.",
    category_th: "กางเกงและกางเกงขาสั้น",
    category_en: "Pants & Bottoms",
    price: 1890,
    salePrice: undefined,
    images: [
      "https://images.unsplash.com/photo-1555689502-c4b22d76c56f?w=800"
    ],
    sizes: ["S", "M", "L", "XL", "XXL"],
    colors: [
      { name: "Black", hex: "#000000" },
      { name: "Gray", hex: "#808080" },
      { name: "Navy", hex: "#000080" }
    ],
    rating: 4.8,
    reviewCount: 392,
    stock: 165,
    isPublished: true,
    createdAt: Timestamp.now(),
    updatedAt: Timestamp.now()
  },
  {
    id: "sw-012",
    name_th: "Wide Leg Pants",
    name_en: "Wide Leg Pants",
    description_th: "Trendy wide leg pants with relaxed fit. Premium cotton twill fabric with pleated front.",
    description_en: "Trendy wide leg pants with relaxed fit. Premium cotton twill fabric with pleated front.",
    category_th: "กางเกงและกางเกงขาสั้น",
    category_en: "Pants & Bottoms",
    price: 2290,
    salePrice: undefined,
    images: [
      "https://images.unsplash.com/photo-1473966968600-fa801b869a1a?w=800"
    ],
    sizes: ["28", "30", "32", "34"],
    colors: [
      { name: "Beige", hex: "#F5F5DC" },
      { name: "Black", hex: "#000000" }
    ],
    rating: 4.6,
    reviewCount: 156,
    stock: 90,
    isPublished: true,
    createdAt: Timestamp.now(),
    updatedAt: Timestamp.now()
  },
  {
    id: "sw-013",
    name_th: "Utility Shorts",
    name_en: "Utility Shorts",
    description_th: "Functional cargo shorts with multiple pockets. Perfect for summer streetwear with adjustable hem.",
    description_en: "Functional cargo shorts with multiple pockets. Perfect for summer streetwear with adjustable hem.",
    category_th: "กางเกงและกางเกงขาสั้น",
    category_en: "Pants & Bottoms",
    price: 1590,
    salePrice: 1290,
    images: [
      "https://images.unsplash.com/photo-1591195853828-11db59a44f6b?w=800"
    ],
    sizes: ["S", "M", "L", "XL"],
    colors: [
      { name: "Khaki", hex: "#C3B091" },
      { name: "Black", hex: "#000000" },
      { name: "Olive", hex: "#556B2F" }
    ],
    rating: 4.7,
    reviewCount: 234,
    stock: 130,
    isPublished: true,
    createdAt: Timestamp.now(),
    updatedAt: Timestamp.now()
  },

  // OUTERWEAR
  {
    id: "sw-014",
    name_th: "Oversized Bomber Jacket",
    name_en: "Oversized Bomber Jacket",
    description_th: "Statement bomber jacket with oversized fit. Premium nylon shell with quilted lining and MA-1 pocket details.",
    description_en: "Statement bomber jacket with oversized fit. Premium nylon shell with quilted lining and MA-1 pocket details.",
    category_th: "เสื้อนอก",
    category_en: "Outerwear",
    price: 3490,
    salePrice: 2990,
    images: [
      "https://images.unsplash.com/photo-1591047139829-d91aecb6caea?w=800",
      "https://images.unsplash.com/photo-1551028719-00167b16eac5?w=800"
    ],
    sizes: ["M", "L", "XL", "XXL"],
    colors: [
      { name: "Black", hex: "#000000" },
      { name: "Olive", hex: "#556B2F" },
      { name: "Navy", hex: "#000080" }
    ],
    rating: 4.9,
    reviewCount: 523,
    stock: 85,
    isPublished: true,
    createdAt: Timestamp.now(),
    updatedAt: Timestamp.now()
  },
  {
    id: "sw-015",
    name_th: "Windbreaker Jacket",
    name_en: "Windbreaker Jacket",
    description_th: "Lightweight windbreaker with packable design. Water-resistant coating and adjustable hood.",
    description_en: "Lightweight windbreaker with packable design. Water-resistant coating and adjustable hood.",
    category_th: "เสื้อนอก",
    category_en: "Outerwear",
    price: 2790,
    salePrice: undefined,
    images: [
      "https://images.unsplash.com/photo-1544022613-e87ca75a784a?w=800"
    ],
    sizes: ["S", "M", "L", "XL"],
    colors: [
      { name: "Black/White", hex: "#000000" },
      { name: "Navy/Red", hex: "#000080" }
    ],
    rating: 4.7,
    reviewCount: 298,
    stock: 95,
    isPublished: true,
    createdAt: Timestamp.now(),
    updatedAt: Timestamp.now()
  },
  {
    id: "sw-016",
    name_th: "Denim Trucker Jacket",
    name_en: "Denim Trucker Jacket",
    description_th: "Classic trucker jacket in premium denim. Vintage wash with button closure and chest pockets.",
    description_en: "Classic trucker jacket in premium denim. Vintage wash with button closure and chest pockets.",
    category_th: "เสื้อนอก",
    category_en: "Outerwear",
    price: 2990,
    salePrice: undefined,
    images: [
      "https://images.unsplash.com/photo-1576995853123-5a10305d93c0?w=800"
    ],
    sizes: ["S", "M", "L", "XL"],
    colors: [
      { name: "Light Blue", hex: "#ADD8E6" },
      { name: "Black", hex: "#000000" }
    ],
    rating: 4.8,
    reviewCount: 412,
    stock: 70,
    isPublished: true,
    createdAt: Timestamp.now(),
    updatedAt: Timestamp.now()
  },
  {
    id: "sw-017",
    name_th: "Puffer Vest",
    name_en: "Puffer Vest",
    description_th: "Quilted puffer vest for layering. Lightweight insulation with side pockets and high collar.",
    description_en: "Quilted puffer vest for layering. Lightweight insulation with side pockets and high collar.",
    category_th: "เสื้อนอก",
    category_en: "Outerwear",
    price: 2390,
    salePrice: 1990,
    images: [
      "https://images.unsplash.com/photo-1611329857570-f02f340e7378?w=800"
    ],
    sizes: ["M", "L", "XL"],
    colors: [
      { name: "Black", hex: "#000000" },
      { name: "Gray", hex: "#808080" }
    ],
    rating: 4.6,
    reviewCount: 187,
    stock: 65,
    isPublished: true,
    createdAt: Timestamp.now(),
    updatedAt: Timestamp.now()
  },
  {
    id: "sw-018",
    name_th: "Coach Jacket",
    name_en: "Coach Jacket",
    description_th: "Classic coach jacket with snap button closure. Water-resistant nylon with mesh lining.",
    description_en: "Classic coach jacket with snap button closure. Water-resistant nylon with mesh lining.",
    category_th: "เสื้อนอก",
    category_en: "Outerwear",
    price: 2190,
    salePrice: undefined,
    images: [
      "https://images.unsplash.com/photo-1592492152545-a46c43b3e1d4?w=800"
    ],
    sizes: ["S", "M", "L", "XL", "XXL"],
    colors: [
      { name: "Black", hex: "#000000" },
      { name: "Burgundy", hex: "#800020" },
      { name: "Forest", hex: "#228B22" }
    ],
    rating: 4.7,
    reviewCount: 334,
    stock: 110,
    isPublished: true,
    createdAt: Timestamp.now(),
    updatedAt: Timestamp.now()
  },

  // ACCESSORIES
  {
    id: "sw-019",
    name_th: "Classic Snapback Cap",
    name_en: "Classic Snapback Cap",
    description_th: "Structured snapback with embroidered logo. Adjustable snap closure with flat brim.",
    description_en: "Structured snapback with embroidered logo. Adjustable snap closure with flat brim.",
    category_th: "เครื่องประดับ",
    category_en: "Accessories",
    price: 790,
    salePrice: 590,
    images: [
      "https://images.unsplash.com/photo-1588850561407-ed78c282e89b?w=800"
    ],
    sizes: ["One Size"],
    colors: [
      { name: "Black", hex: "#000000" },
      { name: "Navy", hex: "#000080" },
      { name: "White", hex: "#FFFFFF" }
    ],
    rating: 4.8,
    reviewCount: 456,
    stock: 250,
    isPublished: true,
    createdAt: Timestamp.now(),
    updatedAt: Timestamp.now()
  },
  {
    id: "sw-020",
    name_th: "Beanie Hat",
    name_en: "Beanie Hat",
    description_th: "Warm knit beanie for cold days. Soft acrylic yarn with fold-up cuff and woven label.",
    description_en: "Warm knit beanie for cold days. Soft acrylic yarn with fold-up cuff and woven label.",
    category_th: "เครื่องประดับ",
    category_en: "Accessories",
    price: 590,
    salePrice: undefined,
    images: [
      "https://images.unsplash.com/photo-1576871337622-98d48d1cf531?w=800"
    ],
    sizes: ["One Size"],
    colors: [
      { name: "Black", hex: "#000000" },
      { name: "Gray", hex: "#808080" },
      { name: "Beige", hex: "#F5F5DC" }
    ],
    rating: 4.9,
    reviewCount: 678,
    stock: 320,
    isPublished: true,
    createdAt: Timestamp.now(),
    updatedAt: Timestamp.now()
  },
  {
    id: "sw-021",
    name_th: "Crossbody Bag",
    name_en: "Crossbody Bag",
    description_th: "Minimalist crossbody bag with adjustable strap. Multiple compartments with YKK zippers.",
    description_en: "Minimalist crossbody bag with adjustable strap. Multiple compartments with YKK zippers.",
    category_th: "เครื่องประดับ",
    category_en: "Accessories",
    price: 1290,
    salePrice: undefined,
    images: [
      "https://images.unsplash.com/photo-1590874103328-eac38a683ce7?w=800"
    ],
    sizes: ["One Size"],
    colors: [
      { name: "Black", hex: "#000000" },
      { name: "Tan", hex: "#D2B48C" }
    ],
    rating: 4.7,
    reviewCount: 267,
    stock: 140,
    isPublished: true,
    createdAt: Timestamp.now(),
    updatedAt: Timestamp.now()
  },
  {
    id: "sw-022",
    name_th: "Canvas Backpack",
    name_en: "Canvas Backpack",
    description_th: "Durable canvas backpack with laptop compartment. Padded shoulder straps and multiple organizer pockets.",
    description_en: "Durable canvas backpack with laptop compartment. Padded shoulder straps and multiple organizer pockets.",
    category_th: "เครื่องประดับ",
    category_en: "Accessories",
    price: 1790,
    salePrice: 1490,
    images: [
      "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=800"
    ],
    sizes: ["One Size"],
    colors: [
      { name: "Black", hex: "#000000" },
      { name: "Olive", hex: "#556B2F" },
      { name: "Navy", hex: "#000080" }
    ],
    rating: 4.8,
    reviewCount: 534,
    stock: 95,
    isPublished: true,
    createdAt: Timestamp.now(),
    updatedAt: Timestamp.now()
  },
  {
    id: "sw-023",
    name_th: "Leather Belt",
    name_en: "Leather Belt",
    description_th: "Premium leather belt with metal buckle. Genuine leather with contrast stitching.",
    description_en: "Premium leather belt with metal buckle. Genuine leather with contrast stitching.",
    category_th: "เครื่องประดับ",
    category_en: "Accessories",
    price: 890,
    salePrice: undefined,
    images: [
      "https://images.unsplash.com/photo-1624222247344-550fb60583bd?w=800"
    ],
    sizes: ["S", "M", "L", "XL"],
    colors: [
      { name: "Black", hex: "#000000" },
      { name: "Brown", hex: "#654321" }
    ],
    rating: 4.6,
    reviewCount: 189,
    stock: 175,
    isPublished: true,
    createdAt: Timestamp.now(),
    updatedAt: Timestamp.now()
  },
  {
    id: "sw-024",
    name_th: "Crew Socks Pack",
    name_en: "Crew Socks Pack",
    description_th: "Premium cotton crew socks - Pack of 3. Reinforced heel and toe with arch support.",
    description_en: "Premium cotton crew socks - Pack of 3. Reinforced heel and toe with arch support.",
    category_th: "เครื่องประดับ",
    category_en: "Accessories",
    price: 490,
    salePrice: 390,
    images: [
      "https://images.unsplash.com/photo-1586350977771-b3b0abd50c82?w=800"
    ],
    sizes: ["S", "M", "L"],
    colors: [
      { name: "Black", hex: "#000000" },
      { name: "White", hex: "#FFFFFF" },
      { name: "Gray", hex: "#808080" }
    ],
    rating: 4.9,
    reviewCount: 892,
    stock: 450,
    isPublished: true,
    createdAt: Timestamp.now(),
    updatedAt: Timestamp.now()
  },
  {
    id: "sw-025",
    name_th: "Bucket Hat",
    name_en: "Bucket Hat",
    description_th: "Classic bucket hat with reversible design. Cotton twill fabric with packable construction.",
    description_en: "Classic bucket hat with reversible design. Cotton twill fabric with packable construction.",
    category_th: "เครื่องประดับ",
    category_en: "Accessories",
    price: 690,
    salePrice: undefined,
    images: [
      "https://images.unsplash.com/photo-1576993537667-c6d2386f0a97?w=800"
    ],
    sizes: ["One Size"],
    colors: [
      { name: "Black", hex: "#000000" },
      { name: "Beige", hex: "#F5F5DC" },
      { name: "Olive", hex: "#556B2F" }
    ],
    rating: 4.7,
    reviewCount: 345,
    stock: 200,
    isPublished: true,
    createdAt: Timestamp.now(),
    updatedAt: Timestamp.now()
  },
  {
    id: "sw-026",
    name_th: "Canvas Tote Bag",
    name_en: "Canvas Tote Bag",
    description_th: "Heavy-duty canvas tote bag with reinforced handles. Perfect for daily essentials with large capacity.",
    description_en: "Heavy-duty canvas tote bag with reinforced handles. Perfect for daily essentials with large capacity.",
    category_th: "เครื่องประดับ",
    category_en: "Accessories",
    price: 590,
    salePrice: undefined,
    images: [
      "https://images.unsplash.com/photo-1590393226742-d3b56c3fc1b5?w=800"
    ],
    sizes: ["One Size"],
    colors: [
      { name: "Natural", hex: "#FAF0E6" },
      { name: "Black", hex: "#000000" }
    ],
    rating: 4.8,
    reviewCount: 423,
    stock: 280,
    isPublished: true,
    createdAt: Timestamp.now(),
    updatedAt: Timestamp.now()
  },
  {
    id: "sw-027",
    name_th: "Chain Necklace",
    name_en: "Chain Necklace",
    description_th: "Stainless steel chain necklace. Adjustable length with secure lobster clasp.",
    description_en: "Stainless steel chain necklace. Adjustable length with secure lobster clasp.",
    category_th: "เครื่องประดับ",
    category_en: "Accessories",
    price: 890,
    salePrice: 690,
    images: [
      "https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?w=800"
    ],
    sizes: ["One Size"],
    colors: [
      { name: "Silver", hex: "#C0C0C0" },
      { name: "Gold", hex: "#FFD700" }
    ],
    rating: 4.5,
    reviewCount: 156,
    stock: 230,
    isPublished: true,
    createdAt: Timestamp.now(),
    updatedAt: Timestamp.now()
  },
  {
    id: "sw-028",
    name_th: "Waist Bag",
    name_en: "Waist Bag",
    description_th: "Compact waist bag with adjustable strap. Water-resistant material with multiple zipper pockets.",
    description_en: "Compact waist bag with adjustable strap. Water-resistant material with multiple zipper pockets.",
    category_th: "เครื่องประดับ",
    category_en: "Accessories",
    price: 990,
    salePrice: undefined,
    images: [
      "https://images.unsplash.com/photo-1622560480605-d83c853bc5c3?w=800"
    ],
    sizes: ["One Size"],
    colors: [
      { name: "Black", hex: "#000000" },
      { name: "Navy", hex: "#000080" },
      { name: "Gray", hex: "#808080" }
    ],
    rating: 4.7,
    reviewCount: 389,
    stock: 165,
    isPublished: true,
    createdAt: Timestamp.now(),
    updatedAt: Timestamp.now()
  }
];

export default streetwearProducts;
