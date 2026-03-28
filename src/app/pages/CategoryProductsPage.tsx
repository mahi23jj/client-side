import React, { useState } from "react";
import { ArrowLeft, SlidersHorizontal } from "lucide-react";
import { ProductCard } from "../components/ProductCard";
import { EmptyState } from "../components/EmptyState";
import { ProductCardProduct } from "../../types/api";
import { useProductsByCategory } from "../../hooks/useMarketplaceQueries";

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
  const {
    data: rawProducts = [],
    isLoading,
    isFetching,
    error,
  } = useProductsByCategory(categoryId);

  const productsList: ProductCardProduct[] = (rawProducts as any[]).map((p) => ({
    id: p.id,
    name: p.name,
    price: p.price,
    image: p.images?.[0]?.imagePath || "",
    shopId: p.shop?.id || p.shopId || "",
    shopName: p.shop?.shopName || "Unknown",
    description: p.description || "",
    rating: p.ratingAverage || 0,
    reviewCount: p.reviewCount || p.ratingCount || 0,
    ratingAverage: p.ratingAverage || 0,
    isActive: p.isActive,
    categoryId: p.category?.id || "",
  }));

  const categoryName = (rawProducts as any[])?.[0]?.category?.name || "";
  // Sorting
  const sortedProducts = [...productsList].sort((a, b) => {
    if (sortBy === "price-low") return a.price - b.price;
    if (sortBy === "price-high") return b.price - a.price;
    return 0;
  });

  const isInitialLoading = isLoading && productsList.length === 0;

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-100">

      {/* Header */}
      <div className="backdrop-blur-sm border-b sticky top-0 z-10">
        <div className="px-4 py-3">
          <div className="flex items-center gap-3 mb-3">
            <button onClick={onBack} className="p-1 hover:bg-gray-100 rounded-lg" title="Go back" aria-label="Go back">
              <ArrowLeft className="w-5 h-5" />
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
              className="px-3 py-1.5 bg-gray-100 rounded-lg text-sm flex-1"
              title="Sort products"
              aria-label="Sort products"
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
        {isFetching && !isInitialLoading && (
          <p className="text-xs text-gray-500 mb-3">Refreshing products...</p>
        )}

        {isInitialLoading ? (
          <div className="grid grid-cols-2 gap-3">
            {Array.from({ length: 6 }).map((_, idx) => (
              <div key={idx} className="h-56 rounded-xl bg-gray-200 animate-pulse" />
            ))}
          </div>
        ) : error ? (
          <div className="text-center text-red-600 py-10">Failed to load products.</div>
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