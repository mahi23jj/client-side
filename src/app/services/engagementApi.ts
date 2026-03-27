import { apiFetch } from "./clientApi";

export async function trackShopView(shopId: string) {
  return apiFetch(`/engagement/${shopId}/view`, {
    method: "POST",
  });
}

export async function trackSocialMediaClick(shopId: string) {
  return apiFetch(`/engagement/${shopId}/social-media-click`, {
    method: "POST",
  });
}

export async function trackContactClick(shopId: string) {
  return apiFetch(`/engagement/${shopId}/contact-click`, {
    method: "POST",
  });
}