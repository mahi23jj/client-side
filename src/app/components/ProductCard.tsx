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
  const isUnavailable = product.isActive === false;

  return (
    <div
      onClick={isUnavailable ? undefined : onClick}
      className={`relative bg-white rounded-xl overflow-hidden shadow-sm transition-shadow w-full text-left ${
        isUnavailable ? "cursor-not-allowed" : "cursor-pointer hover:shadow-md"
      }`}
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
          <StarRating rating={product.rating}  size="sm" />
          
          <span className="text-xs text-gray-500">
          {product.ratingAverage} 
          ({product.reviewCount})
           
          </span>
        </div>
        <p className="text-blue-600">${product.price}</p>
      </div>

      {isUnavailable && (
        <div className="absolute inset-0 bg-white/75 flex items-center justify-center px-3">
          <p className="text-red-600 font-semibold text-center">Currently unavailable</p>
        </div>
      )}
    </div>
  );
}


//ratingAverage   ratingAverage}
//{product.ratingAverage?.toFixed(1) } 