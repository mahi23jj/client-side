import React, { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { getSavedProducts, saveProduct, unsaveProduct } from "../services/savedApi";

interface AppContextType {
  savedProducts: Set<string>;
  followedShops: Set<string>;
  toggleSavedProduct: (productId: string, shopId: string) => void;
  toggleFollowShop: (shopId: string) => void;
  isSaved: (productId: string) => boolean;
  isFollowing: (shopId: string) => boolean;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

function parseStoredStringArray(key: string): string[] {
  try {
    const raw = localStorage.getItem(key);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed.filter((item) => typeof item === "string") : [];
  } catch {
    return [];
  }
}

export function AppProvider({ children }: { children: ReactNode }) {
  const [savedProducts, setSavedProducts] = useState<Set<string>>(
    () => new Set(parseStoredStringArray("savedProducts"))
  );

  const [followedShops, setFollowedShops] = useState<Set<string>>(
    () => new Set(parseStoredStringArray("followedShops"))
  );

  // ✅ Sync with backend API on load
  useEffect(() => {
    const fetchSavedFromAPI = async () => {
      try {
        const res = await getSavedProducts();
        // assume API returns array of product objects
        const ids = res.data.map((p: any) => p.id);
        setSavedProducts(new Set(ids));
        localStorage.setItem("savedProducts", JSON.stringify(ids));
      } catch (err) {
        console.error("Failed to fetch saved products from API", err);
      }
    };
    fetchSavedFromAPI();
  }, []);

  useEffect(() => {
    localStorage.setItem("savedProducts", JSON.stringify(Array.from(savedProducts)));
  }, [savedProducts]);

  useEffect(() => {
    localStorage.setItem("followedShops", JSON.stringify(Array.from(followedShops)));
  }, [followedShops]);

  const toggleSavedProduct = async (productId: string, shopId: string) => {
    setSavedProducts((prev) => {
      const next = new Set(prev);

      if (next.has(productId)) {
        unsaveProduct(productId, shopId);   // API call
        next.delete(productId);
      } else {
        saveProduct(productId, shopId);     // API call
        next.add(productId);
      }

      return next;
    });
  };

  const toggleFollowShop = (shopId: string) => {
    setFollowedShops((prev) => {
      const next = new Set(prev);
      if (next.has(shopId)) {
        next.delete(shopId);
      } else {
        next.add(shopId);
      }
      return next;
    });
  };

  const isSaved = (productId: string) => savedProducts.has(productId);
  const isFollowing = (shopId: string) => followedShops.has(shopId);

  return (
    <AppContext.Provider
      value={{
        savedProducts,
        followedShops,
        toggleSavedProduct,
        toggleFollowShop,
        isSaved,
        isFollowing,
      }}
    >
      {children}
    </AppContext.Provider>
  );
}

export function useAppContext() {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error("useAppContext must be used within AppProvider");
  }
  return context;
}
