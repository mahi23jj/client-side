import React from "react";
import { Category } from "../data/mockData";

interface CategoryCardProps {
  category: Category;
  onClick: () => void;
}

export function CategoryCard({ category, onClick }: CategoryCardProps) {
  return (
    <button
      onClick={onClick}
      className="
        group relative w-full overflow-hidden
        rounded-2xl p-[1px]
        bg-gradient-to-br from-blue-500 to-blue-400
        transition-all duration-300
        hover:scale-105
      "
    >
      <div
        className="
          flex flex-col items-center justify-center gap-3
          rounded-2xl bg-white
          p-6
          shadow-md hover:shadow-lg
          transition-all duration-300
          hover:bg-blue-50
        "
      >
        {/* Icon with colored circle 
        <div className="relative flex items-center justify-center w-16 h-16 rounded-full bg-blue-100">
          <div
            className="
              text-5xl text-blue-600 transition-transform duration-300
              group-hover:scale-110 group-hover:-translate-y-1
            "
          >
            {category.icon}
          </div>
        </div>*/}

        {/* Category Name */}
        <p
          className="
            text-center text-base  text-gray-800
            group-hover:text-blue-600
            transition-colors duration-300 font-serif
          "
        >
          {category.name}
        </p>
      </div>
    </button>
  );
}