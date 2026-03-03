import { useEffect, useState } from "react";
import { HomePage } from "./pages/HomePage";
import { CategoryProductsPage } from "./pages/CategoryProductsPage";
import { ProductDetailPage } from "./pages/ProductDetailPage";
import { ShopDetailPage } from "./pages/ShopDetailPage";
import { WriteReviewPage } from "./pages/WriteReviewPage";
import { SavedProductsPage } from "./pages/SavedProductsPage";
import { SearchResultsPage } from "./pages/SearchResultsPage";
import { AppProvider } from "./contexts/AppContext";
import React from "react";
import { getTokenFromUrl } from "./utils/auth";
import { telegramLogin } from "./services/authApi";

type Page =
  | { type: "home" }
  | { type: "category"; categoryId: string }
  | { type: "product"; productId: string }
  | { type: "shop"; shopId: string }
  | { type: "review"; productId: string; shopId: string; productName?: string } // ✅ update
  | { type: "saved" }
  | { type: "search"; query: string };

export default function App() {
  const [token, setToken] = useState<string | null>(null);

  useEffect(() => {
    const token = new URLSearchParams(window.location.search).get("token");
    if (token) {
      fetch("https://backend-ikou.onrender.com/api/me", {
        headers: { Authorization: `Bearer ${token}` }
      })
        .then(res => res.json())
        .then(user => setUser(user));
    }
  }, []);
    
  const [currentPage, setCurrentPage] = useState<Page>({ type: "home" });
  const [pageHistory, setPageHistory] = useState<Page[]>([{ type: "home" }]);

  const navigateTo = (page: Page) => {
    setCurrentPage(page);
    setPageHistory([...pageHistory, page]);
  };

  const goBack = () => {
    if (pageHistory.length > 1) {
      const newHistory = pageHistory.slice(0, -1);
      setPageHistory(newHistory);
      setCurrentPage(newHistory[newHistory.length - 1]);
    }
  };

  return (
    <AppProvider>
      <div className="max-w-md mx-auto bg-white min-h-screen">
        {currentPage.type === "home" && (
          <HomePage
            onCategorySelect={(categoryId) =>
              navigateTo({ type: "category", categoryId })
            }
            onSearch={(query) => navigateTo({ type: "search", query })}
            onViewSaved={() => navigateTo({ type: "saved" })}
          />
        )}

        {currentPage.type === "category" && (
          <CategoryProductsPage
            categoryId={currentPage.categoryId}
            onBack={goBack}
            onProductSelect={(productId) =>
              navigateTo({ type: "product", productId })
            }
          />
        )}

        {currentPage.type === "product" && (
          <ProductDetailPage
            productId={currentPage.productId}
            onBack={goBack}
            onViewShop={(shopId) => navigateTo({ type: "shop", shopId })}
            onWriteReview={(productId, shopId) =>
              navigateTo({ type: "review", productId, shopId }) // ✅ pass shopId
            }
          />
        )}

        {currentPage.type === "shop" && (
          <ShopDetailPage
            shopId={currentPage.shopId}
            onBack={goBack}
            onProductSelect={(productId) =>
              navigateTo({ type: "product", productId })
            }
          />
        )}

        {currentPage.type === "review" && (
          <WriteReviewPage
            productId={currentPage.productId}
            shopId={currentPage.shopId} // ✅ now defined
            productName={currentPage.productName || ""} // fallback empty string
            onBack={goBack}
          />
        )}

        {currentPage.type === "saved" && (
          <SavedProductsPage
            onBack={goBack}
            onProductSelect={(productId) =>
              navigateTo({ type: "product", productId })
            }
          />
        )}

        {currentPage.type === "search" && (
          <SearchResultsPage
            initialQuery={currentPage.query}
            onBack={goBack}
            onProductSelect={(productId) =>
              navigateTo({ type: "product", productId })
            }
          />
        )}
      </div>
    </AppProvider>
  );
}

function setUser(user: any): any {
  throw new Error("Function not implemented.");
}
