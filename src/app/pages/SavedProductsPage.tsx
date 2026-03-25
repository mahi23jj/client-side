import { ArrowLeft, Bookmark } from "lucide-react";
import { ProductCard } from "../components/ProductCard";
import { EmptyState } from "../components/EmptyState";
import { useAppContext } from "../contexts/AppContext";
import React, { useEffect, useState } from "react";
import { saveProduct, unsaveProduct, getSavedProducts } from "../services/savedApi";

interface SavedProductsPageProps {
  onBack: () => void;
  onProductSelect: (productId: string) => void;
}

export function SavedProductsPage({
  onBack,
  onProductSelect,
}: SavedProductsPageProps) {
  const { savedProducts, toggleSavedProduct } = useAppContext();

  const [productsList, setProductsList] = useState<any[]>([]); // real backend products
  const [loading, setLoading] = useState(true);

  // Fetch saved products from API
  useEffect(() => {
    const fetchSaved = async () => {
      setLoading(true);
      try {
        const res = await getSavedProducts();
        // Assuming API returns: { data: [ { productId, shopId, ...productDetails } ] }
        setProductsList(res.data || []);
      } catch (err) {
        console.error("Failed to fetch saved products:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchSaved();
  }, []);

  // Handle save/unsave
  const handleSaveProduct = async (productId: string, shopId: string) => {
    try {
      if (savedProducts.has(productId)) {
        await unsaveProduct(productId, shopId);
      } else {
        await saveProduct(productId, shopId);
      }
      toggleSavedProduct(productId,shopId ); // update context state
      // Update local list immediately
      setProductsList((prev) =>
        savedProducts.has(productId)
          ? prev.filter((p) => p.id !== productId)
          : prev
      );
    } catch (err: unknown) {
      if (err instanceof Error) {
        console.error("Error saving/unsaving product:", err.message);
      } else {
        console.error("Error saving/unsaving product:", err);
      }
    }
  };

  if (loading)
    return (
      <div className="p-4 text-center text-gray-500">
        Loading saved products...
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
              {productsList.map((product) => (
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
