import { ArrowLeft, Bookmark } from "lucide-react";
import { ProductCard } from "../components/ProductCard";
import { EmptyState } from "../components/EmptyState";
import { useAppContext } from "../contexts/AppContext";
import React from "react";
import { saveProduct, unsaveProduct } from "../services/savedApi";
import { useSavedProducts } from "../../hooks/useMarketplaceQueries";
import { useQueryClient } from "@tanstack/react-query";

interface SavedProductsPageProps {
  onBack: () => void;
  onProductSelect: (productId: string) => void;
}

export function SavedProductsPage({
  onBack,
  onProductSelect,
}: SavedProductsPageProps) {
  const { savedProducts, toggleSavedProduct } = useAppContext();
  const queryClient = useQueryClient();
  const userId = "me";
  const { data, isLoading, isFetching } = useSavedProducts(userId);
  const productsList = data?.items ?? [];

  // Handle save/unsave
  const handleSaveProduct = async (productId: string, shopId: string) => {
    try {
      if (savedProducts.has(productId)) {
        await unsaveProduct(productId, shopId);
      } else {
        await saveProduct(productId, shopId);
      }
      toggleSavedProduct(productId,shopId ); // update context state

      queryClient.setQueryData(["saved-products", userId], (previous: any) => {
        if (!previous) return previous;

        if (savedProducts.has(productId)) {
          return {
            ...previous,
            items: (previous.items || []).filter((p: any) => p.id !== productId),
          };
        }

        return previous;
      });
    } catch (err: unknown) {
      if (err instanceof Error) {
        console.error("Error saving/unsaving product:", err.message);
      } else {
        console.error("Error saving/unsaving product:", err);
      }
    }
  };

  const isInitialLoading = isLoading && productsList.length === 0;

  if (isInitialLoading)
    return (
      <div className="p-4 grid grid-cols-2 gap-3">
        {Array.from({ length: 4 }).map((_, idx) => (
          <div key={idx} className="h-56 rounded-xl bg-gray-200 animate-pulse" />
        ))}
      </div>
    );

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 sticky top-0 z-10">
        <div className="px-4 py-3 flex items-center gap-3">
          <button
            onClick={onBack}
            className="p-1 hover:bg-red-100 rounded-lg"
            title="Go back"
            aria-label="Go back"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <h1 className="text-lg">Saved Products</h1>
        </div>
      </div>

      {/* Content */}
      <div className="p-4">
        {isFetching && !isInitialLoading && (
          <p className="text-xs text-gray-500 mb-3">Refreshing saved products...</p>
        )}

        {productsList.length === 0 ? (
          <EmptyState
            icon={<Bookmark className="w-12 h-12 text-gray-300" />}
            title="No saved products"
            description="Products you bookmark will appear here for easy access"
          />
        ) : (
          <>
            <p className="text-sm text-gray-600 mb-4">
              {productsList.length} {productsList.length === 1 ? "item" : "items"} saved
            </p>
            <div className="grid grid-cols-2 gap-3">
              {productsList.map((product: any) => (
                <ProductCard
                key={product.id}
                product={{
                  ...product,
                  isActive: product.isActive,
                  image:
                    product.images?.[0]?.imagePath?.startsWith("http")
                      ? product.images[0].imagePath
                      : `https://backend-ikou.onrender.com${product.images?.[0]?.imagePath}` || "/placeholder-image.png",
                }}
                onClick={() => {
                  if (product.isActive === false) return;
                  onProductSelect(product.id);
                }}
                onSave={() => handleSaveProduct(product.id, product.shopId)}
              />
              
              
              
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
}
