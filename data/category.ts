import { Category } from "@/types";

const categories: Category[] = [
  {
    id: "all",
    name: "All Items",
    slug: "all-items",
    description: "Browse all available products",
    productCount: 0,
    isActive: true
  },
  {
    id: "dress",
    name: "Dress",
    slug: "dress",
    description: "Elegant dresses for all occasions",
    productCount: 0,
    isActive: true
  },
  {
    id: "t-shirt",
    name: "T-Shirt",
    slug: "t-shirt",
    description: "Comfortable and stylish t-shirts",
    productCount: 0,
    isActive: true
  },
  {
    id: "pants",
    name: "Pants",
    slug: "pants",
    description: "Quality pants for everyday wear",
    productCount: 0,
    isActive: true
  }
];

export default categories;
