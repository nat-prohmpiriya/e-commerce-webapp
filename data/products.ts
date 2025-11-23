import { Product } from "@/types";
import { Timestamp } from "firebase/firestore";

const products: Product[] = [
  {
    id: "1",
    name: "Modern Light Clothes",
    description: "Its simple and elegant shape makes it perfect for those of you who like you who want minimalist clothes",
    category: "T-Shirt",
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
    name: "Light Dress Bless",
    description: "Its simple and elegant shape makes it perfect for those of you who like you who want minimalist clothes",
    category: "Dress",
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
    name: "Casual White Outfit",
    description: "Perfect for casual day out with friends and family",
    category: "T-Shirt",
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
    name: "Elegant Summer Dress",
    description: "Lightweight and comfortable for summer days",
    category: "Dress",
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
