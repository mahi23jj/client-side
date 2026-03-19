import React from "react";
import Image from "next/image";
import { Category } from "../data/mockData";
import { categoryIcons } from "../data/categoryIcons";

interface CategoryCardProps {
  category: Category;
  onClick: () => void;
}

export function CategoryCard({ category, onClick }: CategoryCardProps) {
  return (
    <button
  onClick={onClick}
  className="
    relative w-full overflow-hidden border rounded-2xl
    bg-gradient-to-br from-blue-500 to-blue-400
    transition-all duration-300 hover:scale-105
    p-0
  "
>
  <div
    className="
      relative flex flex-col items-center justify-center gap-3
      rounded-2xl bg-white p-6
      shadow-md hover:shadow-lg
      transition-all duration-300 hover:bg-blue-50
      w-full h-full
    "
    style={{ boxSizing: "border-box" }}
  >

    {/* Category Icon */}

    <div className="relative flex items-center justify-center w-16 h-16 rounded-full bg-blue-100 overflow-hidden">
      {categoryIcons[category.name] && (
        <img
          src={categoryIcons[category.name]}
          alt={category.name}
          className="w-full h-full object-cover"
        />
      )}
    </div>

      {/* Category Name */}
    <p className="text-center text-base text-gray-800 group-hover:text-blue-600 transition-colors duration-300 font-serif">
      {category.name}
    </p>
  </div>
</button>
  );
}