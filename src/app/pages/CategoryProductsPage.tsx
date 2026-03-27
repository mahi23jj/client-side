"use client";

import React, { useState, useEffect } from "react";
import { ArrowLeft, SlidersHorizontal } from "lucide-react";
import { ProductCard } from "../components/ProductCard";
import { EmptyState } from "../components/EmptyState";
import { getProductsByCategory } from "../services/productsApi";
import { ProductCardProduct } from "../../types/api";

interface CategoryProductsPageProps {
  categoryId: string;
  onBack: () => void;
  onProductSelect: (productId: string) => void;
}

export function CategoryProductsPage({
  categoryId,
  onBack,
  onProductSelect,
}: CategoryProductsPageProps) {
  const [sortBy, setSortBy] = useState<"newest" | "price-low" | "price-high">("newest");
  const [showFilters, setShowFilters] = useState(false);
  const [productsList, setProductsList] = useState<ProductCardProduct[]>([]);
  const [categoryName, setCategoryName] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(true); // ✅ loading state

  // Fetch products
  useEffect(() => {
    setLoading(true); // start loading
    getProductsByCategory(categoryId)
      .then((data: any[]) => {
        console.log("CATEGORY DATA:", data);
        const mapped: ProductCardProduct[] = data.map((p) => ({
          id: p.id,
          name: p.name,
          price: p.price,
          image: p.images?.[0]?.imagePath || "",
          shopId: p.shop?.id || p.shopId || "",
          shopName: p.shop?.shopName || "Unknown",
          description: p.description || "",
          rating: Number(p.ratingAverage ?? 0),
          reviewCount: Number(p.ratingCount ?? 0), // ✅ FIXED
          ratingAverage: Number(p.ratingAverage ?? 0),
        }));
        setProductsList(mapped);
        if (data[0]?.category?.name) setCategoryName(data[0].category.name);
      })
      .catch((err) => console.error("Error fetching products:", err))
      .finally(() => setLoading(false)); // stop loading
  }, [categoryId]);

  // Sort products
  const sortedProducts = [...productsList].sort((a, b) => {
    if (sortBy === "price-low") return a.price - b.price;
    if (sortBy === "price-high") return b.price - a.price;
    return 0;
  });

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-100">

      {/* Header */}
      <div className="backdrop-blur-sm border-b sticky top-0 z-10">
        <div className="px-4 py-3">
          <div className="flex items-center gap-3 mb-3">
            <button
              onClick={onBack}
              className="p-1 hover:bg-blue-100 rounded-lg transition"
            >
              <ArrowLeft className="w-5 h-5 text-blue-900" />
            </button>
            <div>
              <h1 className="text-lg font-medium text-blue-900">{categoryName || "Category"}</h1>
              <p className="text-sm text-blue-800">{sortedProducts.length} products</p>
            </div>
          </div>

          {/* Filters */}
          <div className="flex gap-2">
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="px-3 py-1.5 bg-blue-50 backdrop-blur-sm rounded-lg text-sm flex items-center gap-2 hover:bg-blue-100 transition"
            >
              <SlidersHorizontal className="w-4 h-4 text-blue-900" />
              Filters
            </button>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              className="px-3 py-1.5 bg-blue-50 backdrop-blur-sm rounded-lg text-sm flex-1 hover:bg-blue-100 transition text-blue-900"
            >
              <option value="newest">Newest</option>
              <option value="price-low">Price: Low to High</option>
              <option value="price-high">Price: High to Low</option>
            </select>
          </div>
        </div>
      </div>

      {/* Products Grid */}
      <div className="p-4">
        {loading ? (
          // ✅ Circular Progress Spinner
          <div className="flex justify-center py-10">
            <div className="w-12 h-12 border-4 border-blue-900 border-t-transparent rounded-full animate-spin"></div>
          </div>
        ) : sortedProducts.length === 0 ? (
          <EmptyState
            icon="📭"
            title="No products yet"
            description="Check back later for new listings from sellers"
          />
        ) : (
          <div className="grid grid-cols-2 gap-3">
            {sortedProducts.map((product) => (
              <div key={product.id} className="transition hover:scale-[1.02]">
                <ProductCard
                  product={product}
                  onClick={() => onProductSelect(product.id)}
                />
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}