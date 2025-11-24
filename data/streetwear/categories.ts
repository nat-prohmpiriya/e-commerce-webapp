import { Category } from "@/types";
import { Timestamp } from "firebase/firestore";

const streetwearCategories: Category[] = [
  {
    id: "all",
    name_th: "สินค้าทั้งหมด",
    name_en: "All Items",
    slug: "all-items",
    description_th: "เรียกดูสินค้าสตรีทแวร์ทั้งหมด",
    description_en: "Browse all streetwear products",
    productCount: 0,
    isActive: true,
    createdAt: Timestamp.now(),
    updatedAt: Timestamp.now()
  },
  {
    id: "tshirts-tops",
    name_th: "เสื้อยืดและเสื้อท็อป",
    name_en: "T-Shirts & Tops",
    slug: "tshirts-tops",
    description_th: "เสื้อยืดและท็อปพื้นฐานสำหรับสตรีทแวร์ประจำวัน",
    description_en: "Essential tees and tops for everyday streetwear",
    productCount: 0,
    isActive: true,
    createdAt: Timestamp.now(),
    updatedAt: Timestamp.now()
  },
  {
    id: "hoodies-sweatshirts",
    name_th: "เสื้อฮู้ดและสเวตเตอร์",
    name_en: "Hoodies & Sweatshirts",
    slug: "hoodies-sweatshirts",
    description_th: "เสื้อฮู้ดและสเวตเตอร์อบอุ่นสำหรับสตรีทสไตล์",
    description_en: "Cozy hoodies and sweatshirts for street style",
    productCount: 0,
    isActive: true,
    createdAt: Timestamp.now(),
    updatedAt: Timestamp.now()
  },
  {
    id: "pants-bottoms",
    name_th: "กางเกงและกางเกงขาสั้น",
    name_en: "Pants & Bottoms",
    slug: "pants-bottoms",
    description_th: "กางเกงสบาย จ็อกเกอร์ และกางเกงขาสั้น",
    description_en: "Comfortable pants, joggers, and shorts",
    productCount: 0,
    isActive: true,
    createdAt: Timestamp.now(),
    updatedAt: Timestamp.now()
  },
  {
    id: "outerwear",
    name_th: "เสื้อนอก",
    name_en: "Outerwear",
    slug: "outerwear",
    description_th: "แจ็คเก็ต วินด์เบรกเกอร์ และบอมเบอร์",
    description_en: "Jackets, windbreakers, and bombers",
    productCount: 0,
    isActive: true,
    createdAt: Timestamp.now(),
    updatedAt: Timestamp.now()
  },
  {
    id: "accessories",
    name_th: "เครื่องประดับ",
    name_en: "Accessories",
    slug: "accessories",
    description_th: "เติมเต็มลุคด้วยหมวก กระเป๋า และอื่นๆ",
    description_en: "Complete your look with hats, bags, and more",
    productCount: 0,
    isActive: true,
    createdAt: Timestamp.now(),
    updatedAt: Timestamp.now()
  }
];

export default streetwearCategories;
