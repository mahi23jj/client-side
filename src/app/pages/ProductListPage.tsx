import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { SlidersHorizontal } from "lucide-react";
import { Header } from "../components/Header";
import { ProductCard } from "../components/ProductCard";
import { Button } from "../components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "../components/ui/dropdown-menu";

import { getCategoryById } from "../services/categoriesApi";
import { getProductsByCategory } from "../services/productsApi";
import { Category, ProductCardProduct } from "../../types/api";
import React from "react";

export function ProductListPage() {
  const { categoryId } = useParams<{ categoryId: string }>();

  const [category, setCategory] = useState<Category | null>(null);
  const [allProducts, setAllProducts] = useState<ProductCardProduct[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [sortBy, setSortBy] = useState<"newest" | "price-low" | "price-high">(
    "newest"
  );

  const fetchProducts = async () => {
    if (!categoryId) return;

    try {
      setLoading(true);
      setError(null);

      const res = await getProductsByCategory(categoryId);
      const products = res.data.products;

      const mapped: ProductCardProduct[] = products.map((p: any) => ({
        id: p.id,
        name: p.name,
        price: p.price,
        image: p.images?.[0]?.imagePath || "",
        shopName: p.shop?.shopName || "Shop",
        rating: Number(p.ratingAverage ?? 0),
        ratingCount: Number(p.ratingCount ?? 0),
        shopId: p.shopId,
        description: p.description || "",
      }));

      setAllProducts(mapped);
    } catch (err) {
      console.error("Failed to fetch products", err);
      setError("Failed to fetch products. Please reload the page.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!categoryId) return;

    const fetchCategoryAndProducts = async () => {
      try {
        setLoading(true);
        setError(null);

        const cat = await getCategoryById(categoryId);
        setCategory(cat);

        await fetchProducts();
      } catch (err) {
        console.error(err);
        setError("Failed to fetch category or products.");
      } finally {
        setLoading(false);
      }
    };

    fetchCategoryAndProducts();

    const interval = setInterval(fetchCategoryAndProducts, 60000);
    return () => clearInterval(interval);
  }, [categoryId]);

  const sortedProducts = [...allProducts].sort((a, b) => {
    if (sortBy === "price-low") return a.price - b.price;
    if (sortBy === "price-high") return b.price - a.price;
    return 0;
  });

  // 🔄 LOADING
  if (loading)
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-white to-blue-100">
        <div className="w-12 h-12 border-4 border-blue-900 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );

  if (error)
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-white to-blue-100">
        <p className="text-red-600">{error}</p>
      </div>
    );

  if (!category) return null;

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-100">

      {/* Header */}
      <Header title={`${category.icon} ${category.name}`} />

      {/* Sort Bar with Glass Effect */}
      <div className="sticky top-[73px] z-10 px-3 mt-2">
        <div className="flex justify-between items-center px-4 py-3
          rounded-2xl bg-white/80 backdrop-blur-md border border-white/40 shadow-sm">

          <span className="text-sm text-blue-900">
            {sortedProducts.length} products
          </span>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="sm" className="gap-2">
                <SlidersHorizontal size={16} />
                Sort
              </Button>
            </DropdownMenuTrigger>

            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => setSortBy("newest")}>
                Newest First
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setSortBy("price-low")}>
                Price Low → High
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setSortBy("price-high")}>
                Price High → Low
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      {/* Products Grid */}
      <main className="p-3 mt-2">
        {sortedProducts.length > 0 ? (
          <div className="grid grid-cols-2 gap-3">
            {sortedProducts.map((product) => (
              <div
                key={product.id}
                className="transition hover:scale-[1.02]"
              >
                <ProductCard
                  product={product}
                  onClick={() => console.log(product.id)}
                />
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-10 text-gray-500">
            No products
          </div>
        )}
      </main>
    </div>
  );
}