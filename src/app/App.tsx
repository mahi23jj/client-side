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
import { authenticateTelegram } from "./utils/getToken";

const AUTH_DEBUG_PREFIX = "[AUTH][App]";

function maskToken(token: string | null | undefined): string {
  if (!token) return "<none>";
  if (token.length <= 12) return `${token.slice(0, 4)}...`;
  return `${token.slice(0, 8)}...${token.slice(-4)} (len=${token.length})`;
}

type Page =
  | { type: "home" }
  | { type: "category"; categoryId: string }
  | { type: "product"; productId: string }
  | { type: "shop"; shopId: string }
  | { type: "review"; productId: string; shopId: string; productName?: string } // ✅ update
  | { type: "saved" }
  | { type: "search"; query: string };

export default function App() {
 
  /*useEffect(() => {
    async function authenticate() {
      const token = getTokenFromUrl();
      if (!token) return;
  
      try {
        const userData = await apiFetch("/me", {}, token);
        setUser(userData);
  
        // Fetch products
        const products = await apiFetch("/products", {}, token);
        products(products);
  
        // Fetch reviews
        const reviews = await apiFetch(`/review/${products}`, {}, token);
        reviews(reviews);
  
        window.history.replaceState({}, document.title, "/"); // remove token from URL
      } catch (err) {
        console.error("API fetch failed", err);
      }
    }
  
    authenticate();
  }, []);*/
  useEffect(() => {
    console.log(`${AUTH_DEBUG_PREFIX} bootstrap start`, {
      href: window.location.href,
      hasTokenInUrl: new URLSearchParams(window.location.search).has("token"),
    });

    const runAuthentication = async () => {
      try {
        const token = await authenticateTelegram();
        const storedToken = localStorage.getItem("token");

        console.log(`${AUTH_DEBUG_PREFIX} bootstrap result`, {
          returnedToken: maskToken(token),
          storedToken: maskToken(storedToken),
          hasStoredToken: Boolean(storedToken),
          currentUrl: window.location.href,
        });
      } catch (error) {
        console.error(`${AUTH_DEBUG_PREFIX} bootstrap error`, error);
      }
    };

    runAuthentication();
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
function setError(message: any) {
  throw new Error("Function not implemented.");
}

function setLoading(arg0: boolean) {
  throw new Error("Function not implemented.");
}

