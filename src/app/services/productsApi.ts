import { Product } from "../data/data";
import { apiFetch } from "./clientApi";

export async function getProductsByCategory(categoryId: string, page = 1, limit = 20) {
  const result = await apiFetch(`/products/${categoryId}?page=${page}&limit=${limit}`);
  return result.data.products;
}

/*export async function getProductDetails(productId: string) {
  const result = await apiFetch(`/products/details/${productId}`);
  //return result.data.product;
  return {
    product: result.data.product,
    shop: result.data.shop,
  };
}*/

export async function getProductDetails(productId: string) {
  const result = await apiFetch(`/products/details/${productId}`);
  
  // The API has "data.product" for product details and "data.shop" for shop
  const product = result.data.product;
  const shop = result.data.shop;

  return { ...product, shop }; // merge shop inside product
}

export const searchProducts = async (query: string): Promise<Product[]> => {
  try {
    const res = await fetch(
      `https://backend-ikou.onrender.com/api/products/search?search=${encodeURIComponent(query)}`,
      { method: "GET", headers: { accept: "*/*" } }
    );
    const json = await res.json();
    if (!res.ok) throw new Error(json.message || "Failed to search products");
    return json.data.products || [];
  } catch (err) {
    console.error("Search error:", err);
    return [];
  }
};