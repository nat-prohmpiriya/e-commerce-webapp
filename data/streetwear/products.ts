import { Product } from "@/types";
import { Timestamp } from "firebase/firestore";

const streetwearProducts: Product[] = [
  // T-SHIRTS & TOPS
  {
    id: "sw-001",
    name: "Oversized Black Tee",
    description: "Premium heavyweight cotton tee with an oversized fit. Perfect for layering or wearing solo. Features reinforced neckline and double-stitched sleeves for durability.",
    category: "T-Shirts & Tops",
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
    name: "Vintage Graphic Tee",
    description: "Retro-inspired graphic tee with vintage wash. Unique print design that captures the essence of 90s streetwear culture.",
    category: "T-Shirts & Tops",
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
    name: "Minimalist Long Sleeve Tee",
    description: "Clean and minimal long sleeve tee made from organic cotton. Comfortable fit for all-day wear with subtle branding.",
    category: "T-Shirts & Tops",
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
    name: "Striped Polo Shirt",
    description: "Classic polo with modern streetwear twist. Premium pique cotton with contrast stripes and embroidered logo.",
    category: "T-Shirts & Tops",
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
    name: "Classic Pullover Hoodie",
    description: "Essential heavyweight hoodie with adjustable drawstrings. Premium fleece lining for maximum comfort and warmth.",
    category: "Hoodies & Sweatshirts",
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
    name: "Vintage Washed Hoodie",
    description: "Oversized hoodie with vintage wash treatment. Unique faded effect makes each piece one-of-a-kind.",
    category: "Hoodies & Sweatshirts",
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
    name: "Zip-Up Tech Hoodie",
    description: "Modern tech hoodie with full zip closure. Features water-resistant fabric and multiple utility pockets.",
    category: "Hoodies & Sweatshirts",
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
    name: "Crewneck Sweatshirt",
    description: "Classic crewneck with embroidered logo. Soft cotton blend fleece with ribbed cuffs and hem.",
    category: "Hoodies & Sweatshirts",
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
    name: "Cargo Utility Pants",
    description: "Multi-pocket cargo pants with adjustable waist. Durable ripstop fabric perfect for urban exploration.",
    category: "Pants & Bottoms",
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
    name: "Straight Fit Jeans",
    description: "Classic straight fit jeans in premium denim. Comfortable mid-rise with traditional 5-pocket styling.",
    category: "Pants & Bottoms",
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
    name: "Tapered Joggers",
    description: "Comfortable joggers with tapered fit. Elastic waistband with drawstring and zippered ankle cuffs.",
    category: "Pants & Bottoms",
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
    name: "Wide Leg Pants",
    description: "Trendy wide leg pants with relaxed fit. Premium cotton twill fabric with pleated front.",
    category: "Pants & Bottoms",
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
    name: "Utility Shorts",
    description: "Functional cargo shorts with multiple pockets. Perfect for summer streetwear with adjustable hem.",
    category: "Pants & Bottoms",
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
    name: "Oversized Bomber Jacket",
    description: "Statement bomber jacket with oversized fit. Premium nylon shell with quilted lining and MA-1 pocket details.",
    category: "Outerwear",
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
    name: "Windbreaker Jacket",
    description: "Lightweight windbreaker with packable design. Water-resistant coating and adjustable hood.",
    category: "Outerwear",
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
    name: "Denim Trucker Jacket",
    description: "Classic trucker jacket in premium denim. Vintage wash with button closure and chest pockets.",
    category: "Outerwear",
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
    name: "Puffer Vest",
    description: "Quilted puffer vest for layering. Lightweight insulation with side pockets and high collar.",
    category: "Outerwear",
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
    name: "Coach Jacket",
    description: "Classic coach jacket with snap button closure. Water-resistant nylon with mesh lining.",
    category: "Outerwear",
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
    name: "Classic Snapback Cap",
    description: "Structured snapback with embroidered logo. Adjustable snap closure with flat brim.",
    category: "Accessories",
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
    name: "Beanie Hat",
    description: "Warm knit beanie for cold days. Soft acrylic yarn with fold-up cuff and woven label.",
    category: "Accessories",
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
    name: "Crossbody Bag",
    description: "Minimalist crossbody bag with adjustable strap. Multiple compartments with YKK zippers.",
    category: "Accessories",
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
    name: "Canvas Backpack",
    description: "Durable canvas backpack with laptop compartment. Padded shoulder straps and multiple organizer pockets.",
    category: "Accessories",
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
    name: "Leather Belt",
    description: "Premium leather belt with metal buckle. Genuine leather with contrast stitching.",
    category: "Accessories",
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
    name: "Crew Socks Pack",
    description: "Premium cotton crew socks - Pack of 3. Reinforced heel and toe with arch support.",
    category: "Accessories",
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
    name: "Bucket Hat",
    description: "Classic bucket hat with reversible design. Cotton twill fabric with packable construction.",
    category: "Accessories",
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
    name: "Canvas Tote Bag",
    description: "Heavy-duty canvas tote bag with reinforced handles. Perfect for daily essentials with large capacity.",
    category: "Accessories",
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
    name: "Chain Necklace",
    description: "Stainless steel chain necklace. Adjustable length with secure lobster clasp.",
    category: "Accessories",
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
    name: "Waist Bag",
    description: "Compact waist bag with adjustable strap. Water-resistant material with multiple zipper pockets.",
    category: "Accessories",
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
