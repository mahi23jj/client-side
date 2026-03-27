import { Bookmark } from "lucide-react";
import { CategoryCard } from "../components/CategoryCard";
import { SearchBar } from "../components/SearchBar";
import { useAppContext } from "../contexts/AppContext";
import React from "react";
import { useCategories, usePrefetchProductsByCategory } from "../../hooks/useMarketplaceQueries";

interface HomePageProps {
  onCategorySelect: (categoryId: string) => void;
  onSearch: (query: string) => void;
  onViewSaved: () => void;
}

export function HomePage({
  onCategorySelect,
  onSearch,
  onViewSaved,
}: HomePageProps) {
  const { savedProducts } = useAppContext();
  const { data: categoriesList = [], isLoading, isFetching, error } = useCategories();
  const prefetchProductsByCategory = usePrefetchProductsByCategory();

  const handleSearch = async (query: string) => {
    if (!query.trim()) return;
    setSearching(true);
    const results = await searchProducts(query);
    setSearchResults(results);
    setSearching(false);
    // Optional: if you still want to propagate to parent
    onSearch(query);
  };

  const isInitialLoading = isLoading && categoriesList.length === 0;

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-100">
      
      {/* Header */}
      <div className="sticky top-0 z-20 backdrop-blur-lg bg-white/70 border-b border-white/40 shadow-sm">
        <div className="px-4 py-3">
          <div className="flex items-center justify-between mb-3">
            
            {/* Logo + Title */}
            <div className="flex items-center gap-3">
              <img
                src="/images/logo.png"
                className="h-12 w-12 rounded-full border border-blue-200 shadow-sm"
                alt="Logo"
              />
              <h1 className="text-lg font-bold text-blue-900 tracking-tight">
                Campus ገበያ
              </h1>
            </div>

            {/* Saved / Bookmark */}
            <button
              onClick={onViewSaved}
              className="relative p-2 rounded-xl hover:bg-blue-50 transition"
              title="Saved products"
            >
              <Bookmark className="w-5 h-5 text-gray-700" />

              {savedProducts.size > 0 && (
                <span className="absolute -top-1 -right-1 bg-blue-600 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center shadow">
                  {savedProducts.size}
                </span>
              )}
            </button>
          </div>

          {/* Search */}
          <SearchBar onSearch={handleSearch} />
        </div>
      </div>

      {/* Categories Section/part*/}

      <div className="p-4">
        <h2 className="text-lg font-bold text-blue-900 tracking-tight mb-4">
          Browse by Category
        </h2>

        {isFetching && !isInitialLoading && (
          <p className="text-xs text-gray-500 mb-3">Refreshing categories...</p>
        )}

        {isInitialLoading ? (
          <div className="grid grid-cols-2 gap-3">
            {Array.from({ length: 6 }).map((_, idx) => (
              <div key={idx} className="h-24 rounded-xl bg-gray-200 animate-pulse" />
            ))}
          </div>
        ) : error ? (
          <div className="text-center text-red-600 py-10">Failed to fetch categories. Please reload the page.</div>
        ) : categoriesList.length === 0 ? (
          <div className="text-center py-10 text-gray-500">
            No categories found.
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-3">
            {categoriesList.map((category: any) => (
              <div
                key={category.id}
                onMouseEnter={() => prefetchProductsByCategory(category.id)}
                onFocus={() => prefetchProductsByCategory(category.id)}
              >
                <CategoryCard
                  category={category}
                  onClick={() => {
                    prefetchProductsByCategory(category.id);
                    onCategorySelect(category.id);
                  }}
                />
              </div>
            ))}
          </div>
        )}
      </div>

       {/* Search Results */}
       {searching && (
        <div className="text-center py-4 text-blue-700">Searching...</div>
      )}

      {searchResults.length > 0 && (
        <div className="p-4">
          <h2 className="text-lg font-bold text-blue-900 tracking-tight mb-2">
            Search Results
          </h2>
          <div className="grid grid-cols-2 gap-4">
            {searchResults.map((product) => (
              <div
                key={product.id}
                className="p-3 border rounded-xl bg-white shadow-sm"
              >
                <img
                   src={product.images?.[0]?.imagePath || "/images/placeholder.png"}
                  alt={product.name}
                  className="h-24 w-full object-cover rounded-md mb-2"
                />
                <h3 className="text-blue-900 font-medium">{product.name}</h3>
               
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Footer / Info */}
      <div className="px-4 pb-8 text-center text-sm text-gray-500">
        <p className="font-medium">🎓 Buy and sell with fellow students</p>
        <p className="mt-1">Contact sellers directly via Telegram</p>
      </div>
    </div>
  );
}