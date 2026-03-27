import { apiFetch } from "./clientApi";
import { Shop } from "../../types/api";

export async function getShopById(shopId: string): Promise<Shop> {
  const result = await apiFetch(`/shop/${shopId}`);
  return result.data.shop;
}