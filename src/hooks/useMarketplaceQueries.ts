import {
  keepPreviousData,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";
import {
  CACHE_TTL,
  getCategories,
  getProductDetail,
  getProductsByCategory,
  getProductsByShop,
  getSavedProducts,
  getShopDetail,
} from "../api/marketplaceApi";

export function useCategories() {
  return useQuery({
    queryKey: ["categories"],
    queryFn: getCategories,
    staleTime: CACHE_TTL.categories,
    gcTime: CACHE_TTL.categories * 2,
    placeholderData: keepPreviousData,
  });
}

export function useProductsByCategory(categoryId?: string) {
  return useQuery({
    queryKey: ["products", "category", categoryId],
    queryFn: () => getProductsByCategory(categoryId as string),
    enabled: Boolean(categoryId),
    staleTime: CACHE_TTL.productsList,
    gcTime: CACHE_TTL.productsList * 3,
    placeholderData: keepPreviousData,
  });
}

export function useProductDetail(productId?: string) {
  return useQuery({
    queryKey: ["product", "detail", productId],
    queryFn: () => getProductDetail(productId as string),
    enabled: Boolean(productId),
    staleTime: CACHE_TTL.productDetail,
    gcTime: CACHE_TTL.productDetail * 3,
    placeholderData: keepPreviousData,
  });
}

export function useShopDetail(shopId?: string) {
  return useQuery({
    queryKey: ["shop", "detail", shopId],
    queryFn: () => getShopDetail(shopId as string),
    enabled: Boolean(shopId),
    staleTime: CACHE_TTL.shopDetail,
    gcTime: CACHE_TTL.shopDetail * 2,
    placeholderData: keepPreviousData,
  });
}

export function useProductsByShop(shopId?: string) {
  return useQuery({
    queryKey: ["products", "shop", shopId],
    queryFn: () => getProductsByShop(shopId as string),
    enabled: Boolean(shopId),
    staleTime: CACHE_TTL.productsList,
    gcTime: CACHE_TTL.productsList * 3,
    placeholderData: keepPreviousData,
  });
}

export function useSavedProducts(userId?: string) {
  return useQuery({
    queryKey: ["saved-products", userId ?? "me"],
    queryFn: () => getSavedProducts(userId),
    staleTime: CACHE_TTL.savedProducts,
    gcTime: CACHE_TTL.savedProducts * 5,
    placeholderData: keepPreviousData,
  });
}

export function usePrefetchProductsByCategory() {
  const queryClient = useQueryClient();

  return (categoryId: string) =>
    queryClient.prefetchQuery({
      queryKey: ["products", "category", categoryId],
      queryFn: () => getProductsByCategory(categoryId),
      staleTime: CACHE_TTL.productsList,
    });
}
