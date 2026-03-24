// src/components/ProductCard.tsx
import React from "react";
import { StarRating } from "./StarRating";
import { ImageWithFallback } from "./figma/ImageWithFallback";
import { ProductCardProduct } from "../../types/api"; // <- use the correct type

interface ProductCardProps {
  product: ProductCardProduct;
  onClick: () => void;
  onSave?: () => void; // optional save button callback
}

export function ProductCard({ product, onClick }: ProductCardProps) {
 // console.log("Product rating in card:", product.ratingAverage);
  return (
    <div
      onClick={onClick}
      className="bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-shadow w-full text-left cursor-pointer"
    >
      <div className="aspect-square bg-gray-100 overflow-hidden">
        <ImageWithFallback
          src={product.image}
          alt={product.name}
          className="w-full h-full object-cover"
        />
      </div>
      <div className="p-3">
        <h3 className="line-clamp-1 mb-1">{product.name}</h3>
        <p className="text-sm text-gray-500 mb-2"> {product.shop?.shopName}</p>
        <div className="flex items-center gap-1 mb-2">
          <StarRating rating={product.ratingAverage}  size="sm" />
          <span>
  {product.ratingAverage?.toFixed(1) ?? "0.0"} 
  ({product.reviewCount})
 
</span>
          <span className="text-xs text-gray-500">
            ({product.reviewCount || 0}) 
          </span>
        </div>
        <p className="text-blue-600">${product.price}</p>
      </div>
    </div>
  );
}


//ratingAverage   ratingAverage}