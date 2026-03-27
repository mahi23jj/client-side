import { apiFetch } from "../app/services/clientApi";

export const CACHE_TTL = {
  categories: 1000 * 60 * 30,
  productsList: 1000 * 60 * 5,
  productDetail: 1000 * 60 * 10,
  shopDetail: 1000 * 60 * 30,
  savedProducts: 1000 * 60 * 2,
} as const;

export async function getCategories() {
  const result = await apiFetch("/categories");
  return result.data.categories;
}

export async function getProductsByCategory(categoryId: string, page = 1, limit = 20) {
  const result = await apiFetch(`/products/${categoryId}?page=${page}&limit=${limit}`);
  return result.data.products;
}

export async function getProductDetail(productId: string) {
  const result = await apiFetch(`/products/details/${productId}`);
  return result.data.product;
}

export async function getShopDetail(shopId: string) {
  const result = await apiFetch(`/shop/${shopId}`);
  return result.data.shop;
}

export async function getProductsByShop(shopId: string) {
  const shop = await getShopDetail(shopId);
  return shop.products ?? [];
}

export async function getSavedProducts(userId?: string) {
  const result = await apiFetch("/save_product/");
  return {
    userId,
    items: result.data ?? [],
  };
}
