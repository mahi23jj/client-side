// src/app/pages/SearchResultsPage.tsx
import React, { useState, useEffect } from "react";
import { ArrowLeft, SlidersHorizontal, Search } from "lucide-react";
import { ProductCard } from "../components/ProductCard";
import { EmptyState } from "../components/EmptyState";
import { ProductCardProduct } from "../../types/api";

import { useCategories } from "../../hooks/useMarketplaceQueries";
import { searchProducts } from "../services/productsApi";

interface SearchResultsPageProps {
  initialQuery?: string;
  onBack: () => void;
  onProductSelect: (productId: string) => void;
}

export function SearchResultsPage({
  initialQuery = "",
  onBack,
  onProductSelect,
}: SearchResultsPageProps) {
  const [searchQuery, setSearchQuery] = useState(initialQuery);
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [sortBy, setSortBy] = useState<"relevance" | "price-low" | "price-high" | "rating">("relevance");
  const [showFilters, setShowFilters] = useState(false);
  const [products, setProducts] = useState<ProductCardProduct[]>([]);
  const [loading, setLoading] = useState(false);

  const { data: categories = [] } = useCategories();

  // Fetch products on searchQuery change
  useEffect(() => {
    if (!searchQuery) {
      setProducts([]);
      return;
    }

    const fetchProducts = async () => {
      setLoading(true);
      try {
        const result = await searchProducts(searchQuery);

        // Map API response to ProductCardProduct
        const mappedProducts: ProductCardProduct[] = result.map((p: any) => ({
          id: p.id,
          name: p.name,
          description: p.description || "",
          price: p.price,
          image: p.images?.[0]?.imagePath || "",
          shopId: p.shopId || "",
          shopName: p.shop?.shopName || "Unknown",
          rating: p.ratingAverage || 0,
    //reviewCount: p.reviewCount || p.ratingCount || 0,
    ratingAverage: p.ratingAverage || 0,
    reviewCount: p.reviewCount || p.ratingCount || 0,
          //ratingAverage: p.ratingAverage ?? 0,
          //rating: p.ratingAverage ?? 0,
         // reviewCount: p.reviewCount ?? p.ratingCount ?? 0,
          isActive: p.isActive ?? true,
          categoryId: p.categoryId,
        }));

        setProducts(mappedProducts);
      } catch (err) {
        console.error("Search error:", err);
        setProducts([]);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [searchQuery]);


  const filteredProducts = products.filter(
    (p) => selectedCategory === "all" || p.categoryId === selectedCategory
  );

  const sortedProducts = [...filteredProducts].sort((a, b) => {
    switch (sortBy) {
      case "price-low":
        return a.price - b.price;
      case "price-high":
        return b.price - a.price;
      case "rating":
        return b.ratingAverage - a.ratingAverage;
      default:
        return 0; 
    }
  });

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 sticky top-0 z-20">
        <div className="px-4 py-3 flex items-center gap-3">
          <button onClick={onBack} className="p-1 hover:bg-gray-100 rounded-lg">
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search products..."
              className="w-full pl-10 pr-4 py-2 bg-gray-100 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
            />
          </div>
          <button
            onClick={() => setShowFilters(!showFilters)}
            className={`p-2 rounded-lg transition-colors ${showFilters ? "bg-blue-100 text-blue-600" : "hover:bg-gray-100"}`}
          >
            <SlidersHorizontal className="w-5 h-5" />
          </button>
        </div>

        {/* Category Filters */}
        {showFilters && (
          <div className="py-3 border-t border-gray-200 flex gap-2 overflow-x-auto">
            <button
              onClick={() => setSelectedCategory("all")}
              className={`px-3 py-1 rounded-full ${
                selectedCategory === "all" ? "bg-blue-600 text-white" : "bg-gray-100 text-gray-700"
              }`}
            >
              All
            </button>
            {categories.map((c: any) => (
              <button
                key={c.id}
                onClick={() => setSelectedCategory(c.id)}
                className={`px-3 py-1 rounded-full ${
                  selectedCategory === c.id ? "bg-blue-600 text-white" : "bg-gray-100 text-gray-700"
                }`}
              >
                {c.name}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Products Grid */}
      <div className="p-4">
        {loading ? (
          <div className="grid grid-cols-2 gap-3">
            {Array.from({ length: 6 }).map((_, idx) => (
              <div key={idx} className="h-56 rounded-xl bg-gray-200 animate-pulse" />
            ))}
          </div>
        ) : sortedProducts.length === 0 ? (
          <EmptyState
            icon="🔍"
            title={searchQuery ? "No products found" : "Start searching"}
            description={searchQuery ? "Try adjusting your search or filters" : "Enter a keyword to search"}
          />
        ) : (
          <div className="grid grid-cols-2 gap-3">
            {sortedProducts.map((product) => (
              <ProductCard
                key={product.id}
                product={product}
                onClick={() => onProductSelect(product.id)}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}