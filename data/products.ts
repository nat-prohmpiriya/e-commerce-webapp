import { Product } from "@/types";
import { Timestamp } from "firebase/firestore";

const products: Product[] = [
  {
    id: "1",
    name_th: "เสื้อผ้าสไตล์โมเดิร์น",
    name_en: "Modern Light Clothes",
    description_th: "รูปทรงเรียบง่ายและสง่างามเหมาะสำหรับคุณที่ชอบเสื้อผ้าสไตล์มินิมอล",
    description_en: "Its simple and elegant shape makes it perfect for those of you who like you who want minimalist clothes",
    category_th: "เสื้อยืด",
    category_en: "T-Shirt",
    price: 212.99,
    salePrice: undefined,
    images: ["/product-demo.jpg"],
    sizes: ["S", "M", "L", "XL"],
    colors: [
      { name: "Black", hex: "#000000" },
      { name: "Gray", hex: "#808080" },
      { name: "White", hex: "#FFFFFF" }
    ],
    rating: 5.0,
    reviewCount: 932,
    stock: 50,
    isPublished: true,
    createdAt: Timestamp.now(),
    updatedAt: Timestamp.now()
  },
  {
    id: "2",
    name_th: "ชุดเดรสสบายๆ",
    name_en: "Light Dress Bless",
    description_th: "รูปทรงเรียบง่ายและสง่างามเหมาะสำหรับคุณที่ชอบเสื้อผ้าสไตล์มินิมอล",
    description_en: "Its simple and elegant shape makes it perfect for those of you who like you who want minimalist clothes",
    category_th: "ชุดเดรส",
    category_en: "Dress",
    price: 162.99,
    salePrice: undefined,
    images: ["/product-demo.jpg"],
    sizes: ["S", "M", "L", "XL"],
    colors: [
      { name: "Black", hex: "#000000" },
      { name: "Gray", hex: "#808080" },
      { name: "Charcoal", hex: "#36454F" }
    ],
    rating: 5.0,
    reviewCount: 7932,
    stock: 30,
    isPublished: true,
    createdAt: Timestamp.now(),
    updatedAt: Timestamp.now()
  },
  {
    id: "3",
    name_th: "ชุดสีขาวลำลอง",
    name_en: "Casual White Outfit",
    description_th: "เหมาะสำหรับการใช้เวลาว่างกับเพื่อนและครอบครัว",
    description_en: "Perfect for casual day out with friends and family",
    category_th: "เสื้อยืด",
    category_en: "T-Shirt",
    price: 189.99,
    salePrice: undefined,
    images: ["/product-demo.jpg"],
    sizes: ["S", "M", "L", "XL"],
    colors: [
      { name: "White", hex: "#FFFFFF" },
      { name: "Beige", hex: "#F5F5DC" }
    ],
    rating: 4.8,
    reviewCount: 456,
    stock: 25,
    isPublished: true,
    createdAt: Timestamp.now(),
    updatedAt: Timestamp.now()
  },
  {
    id: "4",
    name_th: "ชุดเดรสฤดูร้อน",
    name_en: "Elegant Summer Dress",
    description_th: "น้ำหนักเบาและสบายสำหรับวันฤดูร้อน",
    description_en: "Lightweight and comfortable for summer days",
    category_th: "ชุดเดรส",
    category_en: "Dress",
    price: 245.99,
    salePrice: undefined,
    images: ["/product-demo.jpg"],
    sizes: ["S", "M", "L", "XL"],
    colors: [
      { name: "Pink", hex: "#FFC0CB" },
      { name: "Blue", hex: "#ADD8E6" }
    ],
    rating: 4.9,
    reviewCount: 1234,
    stock: 40,
    isPublished: true,
    createdAt: Timestamp.now(),
    updatedAt: Timestamp.now()
  }
];

export default products;
