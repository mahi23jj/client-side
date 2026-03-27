import { useState, useEffect } from "react";
import { ArrowLeft, Search, SlidersHorizontal } from "lucide-react";
import { products, categories } from "../data/mockData";
import { ProductCard } from "../components/ProductCard";
import { EmptyState } from "../components/EmptyState";
import React from "react";

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

  // Filter products based on search query and filters
  const filteredProducts = products.filter((product) => {
    const query = searchQuery.toLowerCase().trim();
    
    // If no search query, return all products
    if (!query) return true;

    // Search in product name, description, and category
    const matchesSearch =
      product.name.toLowerCase().includes(query) ||
      product.description.toLowerCase().includes(query) ||
      categories.find((c) => c.id === product.categoryId)?.name.toLowerCase().includes(query);

    // Filter by category if selected
    const matchesCategory =
      selectedCategory === "all" || product.categoryId === selectedCategory;

    return matchesSearch && matchesCategory;
  });

  // Sort products
  const sortedProducts = [...filteredProducts].sort((a, b) => {
    switch (sortBy) {
      case "price-low":
        return a.price - b.price;
      case "price-high":
        return b.price - a.price;
      case "rating":
        return b.rating - a.rating;
      default:
        return 0; // relevance (original order)
    }
  });

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 sticky top-0 z-20">
        <div className="px-4 py-3">
          <div className="flex items-center gap-3 mb-3">
            <button onClick={onBack} className="p-1 hover:bg-gray-100 rounded-lg">
              <ArrowLeft className="w-5 h-5" />
            </button>
            <form onSubmit={handleSearch} className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search products..."
                  className="w-full pl-10 pr-4 py-2 bg-gray-100 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
                  autoFocus
                />
              </div>
            </form>
            <button
              onClick={() => setShowFilters(!showFilters)}
              className={`p-2 rounded-lg transition-colors ${
                showFilters ? "bg-blue-100 text-blue-600" : "hover:bg-gray-100"
              }`}
            >
              <SlidersHorizontal className="w-5 h-5" />
            </button>
          </div>

          {/* Filters Panel */}
          {showFilters && (
            <div className="py-3 border-t border-gray-200">
              {/* Category Filter */}
              <div className="mb-3">
                <label className="text-sm font-medium mb-2 block">Category</label>
                <div className="flex gap-2 overflow-x-auto pb-2">
                  <button
                    onClick={() => setSelectedCategory("all")}
                    className={`px-3 py-1 rounded-full text-sm whitespace-nowrap transition-colors ${
                      selectedCategory === "all"
                        ? "bg-blue-600 text-white"
                        : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                    }`}
                  >
                    All
                  </button>
                  {categories.map((category) => (
                    <button
                      key={category.id}
                      onClick={() => setSelectedCategory(category.id)}
                      className={`px-3 py-1 rounded-full text-sm whitespace-nowrap transition-colors ${
                        selectedCategory === category.id
                          ? "bg-blue-600 text-white"
                          : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                      }`}
                    >
                      {category.name}
                    </button>
                  ))}
                </div>
              </div>

              {/* Sort By */}
              <div>
                <label className="text-sm font-medium mb-2 block">Sort By</label>
                <div className="flex gap-2 overflow-x-auto pb-2">
                  <button
                    onClick={() => setSortBy("relevance")}
                    className={`px-3 py-1 rounded-full text-sm whitespace-nowrap transition-colors ${
                      sortBy === "relevance"
                        ? "bg-blue-600 text-white"
                        : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                    }`}
                  >
                    Relevance
                  </button>
                  <button
                    onClick={() => setSortBy("price-low")}
                    className={`px-3 py-1 rounded-full text-sm whitespace-nowrap transition-colors ${
                      sortBy === "price-low"
                        ? "bg-blue-600 text-white"
                        : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                    }`}
                  >
                    Price: Low to High
                  </button>
                  <button
                    onClick={() => setSortBy("price-high")}
                    className={`px-3 py-1 rounded-full text-sm whitespace-nowrap transition-colors ${
                      sortBy === "price-high"
                        ? "bg-blue-600 text-white"
                        : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                    }`}
                  >
                    Price: High to Low
                  </button>
                  <button
                    onClick={() => setSortBy("rating")}
                    className={`px-3 py-1 rounded-full text-sm whitespace-nowrap transition-colors ${
                      sortBy === "rating"
                        ? "bg-blue-600 text-white"
                        : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                    }`}
                  >
                    Highest Rated
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Results */}
      <div className="p-4">
        {searchQuery && (
          <p className="text-sm text-gray-600 mb-4">
            {sortedProducts.length} {sortedProducts.length === 1 ? "result" : "results"} for "{searchQuery}"
          </p>
        )}

        {sortedProducts.length === 0 ? (
          <EmptyState
            icon="🔍"
            title={searchQuery ? "No products found" : "Start searching"}
            description={
              searchQuery
                ? "Try adjusting your search or filters"
                : "Enter a keyword to search for products"
            }
          />
        ) : (
          <div className="grid grid-cols-2 gap-3">
            {sortedProducts.map((product) => (
              <ProductCard
                key={product.id}
                product={{
                  ...product,
                  ratingAverage: product.rating, // Map `rating` to `ratingAverage`
                }}
                onClick={() => onProductSelect(product.id)}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
