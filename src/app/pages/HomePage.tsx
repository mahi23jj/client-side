import { Bookmark } from "lucide-react";
import { CategoryCard } from "../components/CategoryCard";
import { SearchBar } from "../components/SearchBar";
import { useAppContext } from "../contexts/AppContext";
import React, { useEffect, useState } from "react";
import { getCategories } from "../services/categoriesApi";
import { Category } from "../../types/api";

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

  const [categoriesList, setCategoriesList] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const handleSearch = (query: string) => {
    if (query.trim()) onSearch(query);
  };

  // Fetch categories
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        setLoading(true);
        setError(null);
        const data = await getCategories();
        setCategoriesList(data);
      } catch (err) {
        console.error(err);
        setError("Failed to fetch categories. Please reload the page.");
      } finally {
        setLoading(false);
      }
    };

    fetchCategories();

    const interval = setInterval(fetchCategories, 60000);
    return () => clearInterval(interval);
  }, []);

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

      {/* Categories Section */}
      <div className="p-4">
        <h2 className="text-lg font-bold text-blue-900 tracking-tight mb-4">
          Browse by Category
        </h2>

        {loading ? (
          <div className="flex justify-center py-16">
            <div className="w-10 h-10 border-4 border-blue-900 border-t-transparent rounded-full animate-spin"></div>
          </div>
        ) : error ? (
          <div className="text-center text-red-600 py-10">{error}</div>
        ) : categoriesList.length === 0 ? (
          <div className="text-center py-10 text-gray-500">
            No categories found.
          </div>
        ) : (
          <div className="grid grid-cols-2  gap-4">
            {categoriesList.map((category) => (
              <CategoryCard
                key={category.id}
                category={category}
                onClick={() => onCategorySelect(category.id)}
              />
            ))}
          </div>
        )}
      </div>

      {/* Footer / Info */}
      <div className="px-4 pb-8 text-center text-sm text-gray-500">
        <p className="font-medium">🎓 Buy and sell with fellow students</p>
        <p className="mt-1">Contact sellers directly via Telegram</p>
      </div>
    </div>
  );
}