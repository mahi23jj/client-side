export interface ProductImage {
  imagePath: string;
}

export interface Product {
  id: string;
  name: string;
  price: number;
  categoryId: string;
  ratingAverage: number;
  images: ProductImage[];
}

export interface SellerUser {
  username: string;
  telegramId: string;
}

export interface Seller {
  user: SellerUser;
  instagram?: string;
  telegram?: string;
  tiktok?: string;
  mainPhone?: string;
  secondaryPhone?: string;
}

export interface Shop {
  id: string;
  shopName: string;
  bio: string;
  rating: number;
  isOpen: boolean;
  status: string;
  followersCount: number;
  profileImageUrl: string;
  products: Product[];
  seller: Seller;
}

// types/ProductCardProduct.ts

interface ProductCardProps {
  product: ProductCardProduct;
  onClick: () => void;
}

export interface ProductCardProduct {
id: string;
name: string;
price: number;
image: string;
shopId: string;
shopName: string;
description: string;
rating: number;
reviewCount: number; // <-- add this
ratingAverage: number; // ⚠ required
shop?: {
  shopName: string;
};
}

export interface ReviewRequestBody {
rating: number;
comment?: string;
}

// src/types/api.ts or a separate types file
export interface Review {
userName: string;
rating: number;
comment: string;
date: string;
}

export interface ProductCardProduct {
id: string;
name: string;
price: number;
image: string;
shopName: string;

rating: number;        // ✅ REQUIRED
reviewCount: number;   // ✅ REQUIRED
ratingAverage: number;  // <-- add this if you really want
shop?: {
  shopName: string;
};
}

export interface Category {
  id: string;
  name: string;
  icon: string;
}