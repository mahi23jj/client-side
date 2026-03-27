import { useEffect, useMemo, useState } from "react";
import { ArrowLeft, ExternalLink, Instagram, Facebook, Calendar, Users, Flag } from "lucide-react";
import { EmptyState } from "../components/EmptyState";
import { ReportShopModal } from "../components/ReportShopModal";
import React from "react";
import { ProductCardProduct, Shop } from "../../types/api";
import { reportShop } from "../services/reportApi";
import { toggleFollowShopApi } from "../services/followApi";
import { Productdisplay } from "../components/RatingStars";
import { useProductsByShop, useShopDetail } from "../../hooks/useMarketplaceQueries";
import { trackSocialMediaClick } from "../services/engagementApi";

interface ShopDetailPageProps {
  shopId: string;
  onBack: () => void;
  onProductSelect: (productId: string) => void;
}

export function ShopDetailPage({
  shopId,
  onBack,
  onProductSelect,
}: ShopDetailPageProps) {
  const [showReportModal, setShowReportModal] = useState(false);
  const [shop, setShop] = useState<Shop | null>(null);
  const {
    data: shopData,
    isLoading: shopLoading,
    isFetching: shopFetching,
    error: shopError,
  } = useShopDetail(shopId);
  const {
    data: productsData = [],
    isLoading: productsLoading,
    isFetching: productsFetching,
    error: productsError,
  } = useProductsByShop(shopId);

  useEffect(() => {
    if (shopData) {
      setShop(shopData as Shop);
    }
  }, [shopData]);

  const shopProducts: ProductCardProduct[] = useMemo(
    () =>
      (productsData as any[]).map((p: any) => ({
        id: p.id,
        name: p.name,
        price: p.price,
        description: p.description || "",
        image: p.images?.[0]?.imagePath || "/placeholder-image.png",
        shopId,
        shopName: shop?.shopName || "Shop",
        rating: Number(p.ratingAverage ?? 0),
        reviewCount: Number(p.ratingCount ?? p.reviewCount ?? 0),
        ratingAverage: Number(p.ratingAverage ?? 0),
        isActive: p.isActive,
      })),
    [productsData, shop?.shopName, shopId]
  );

  const isInitialLoading = (shopLoading || productsLoading) && !shop;
  const hasError = shopError || productsError;

  if (isInitialLoading) {
    return (
      <div className="min-h-screen bg-gray-50 p-4 space-y-3">
        <div className="h-10 w-28 rounded bg-gray-200 animate-pulse" />
        <div className="h-40 rounded-xl bg-gray-200 animate-pulse" />
        <div className="h-56 rounded-xl bg-gray-200 animate-pulse" />
      </div>
    );
  }
  if (hasError) return <div className="p-4 text-red-500">Failed to load shop data.</div>;
  if (!shop) return <div className="p-4">Shop not found</div>;

  const handleContactShop = () => {
    const telegramId = shop.seller?.user?.telegramId;
    if (!telegramId) return;
    window.open(`https://t.me/${telegramId}`, "_blank");
  };

  const handleFollowClick = async () => {
    if (!shop) return;

    const previousState = {
      isFollowed: shop.isFollowed,
      followersCount: shop.followersCount,
    };

    const optimisticIsFollowed = !shop.isFollowed;
    const optimisticFollowersCount = Math.max(
      0,
      shop.followersCount + (optimisticIsFollowed ? 1 : -1)
    );

    // Optimistic UI: update immediately, then sync with backend.
    setShop((prevShop) =>
      prevShop
        ? {
          ...prevShop,
          isFollowed: optimisticIsFollowed,
          followersCount: optimisticFollowersCount,
        }
        : prevShop
    );

    try {
      const response = await toggleFollowShopApi(shopId) as any;

      // API sometimes returns fields directly or under data
      const payload = response?.data ?? response;
      const backendIsFollowed = payload?.isFollowed;
      const backendFollowersCount = payload?.followersCount;

      setShop((prevShop) => {
        if (!prevShop) return prevShop;

        const nextIsFollowed =
          typeof backendIsFollowed === "boolean"
            ? backendIsFollowed
            : prevShop.isFollowed;

        const computedFollowers =
          previousState.followersCount + (nextIsFollowed ? 1 : -1);
        const nextFollowersCount =
          typeof backendFollowersCount === "number"
            ? backendFollowersCount
            : Math.max(0, computedFollowers);

        return {
          ...prevShop,
          isFollowed: nextIsFollowed,
          followersCount: Math.max(0, nextFollowersCount),
        };
      });
    } catch (err: any) {
      // Roll back optimistic change if backend sync fails.
      setShop((prevShop) =>
        prevShop
          ? {
            ...prevShop,
            isFollowed: previousState.isFollowed,
            followersCount: previousState.followersCount,
          }
          : prevShop
      );
      alert(err.message);
    }
  };

  const handleSocialClick = (url: string) => {
    if (!url) return;
    trackSocialMediaClick(shopId).catch(() => { });
    window.open(url, "_blank");
  };

  const handleReportSubmit = async (reason: string) => {
    try {
      await reportShop(shopId, { reason });
      alert("Thank you for your report. Our team will review it shortly.");
      setShowReportModal(false);
    } catch (err: any) {
      alert(`Failed to submit report: ${err.message}`);
    }
  };

  const yearsActive = 0;

  return (
    <div className="min-h-screen bg-gray-50">
      {(shopFetching || productsFetching) && (
        <div className="text-xs text-gray-500 px-4 py-2 bg-white border-b">Refreshing shop...</div>
      )}
      {/* Header */}
      <div className="bg-white/60 backdrop-blur-sm border-b border-gray-200 ">
        <div className="px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button onClick={onBack} className="p-1 hover:bg-blue-100 rounded-lg transition">
              <ArrowLeft className="w-5 h-5 text-gray-900" />
            </button>
            <h1 className="text-lg font-medium text-blue-900">Shop Details</h1>
          </div>
          <button
            onClick={() => setShowReportModal(true)}
            className="p-1 hover:bg-blue-100 rounded-lg transition"
            title="Report shop"
          >
            <Flag className="w-5 h-5 text-gray-900" />
          </button>
        </div>
      </div>

      {/* Shop Info */}
      <div className="bg-white/50 backdrop-blur-sm p-4 border-b border-gray-200">
        <div className="flex flex-col gap-3 mb-3">
          <div className="flex items-center gap-4">
            <img
              src={shop.profileImageUrl}
              alt="Shop logo"
              className="w-16 h-16 rounded-full object-cover border-2 border-white shadow"
            />

            <div className="flex flex-col justify-center">
              <h3 className="text-lg font-semibold text-gray-800">
                {shop.shopName}
              </h3>
              <p className="text-sm text-gray-500">{shop.bio}</p>
            </div>
          </div>

          {/* Trust Indicators */}
          <div className="flex flex-wrap gap-4 text-sm text-black">
            <div className="flex items-center gap-1"><Users className="w-4 h-4" /> <span className="text-gray-600">{shop.followersCount} followers</span></div>
            <div className="flex items-center gap-1"><Calendar className="w-4 h-4" /> <span className="text-gray-600">{yearsActive > 0 ? `${yearsActive}+ years` : "New shop"}</span></div>
          </div>

          {/* Social Media Links */}
          <div className="flex gap-2">
            {shop.seller?.instagram && (
              <button
                onClick={() => handleSocialClick(`https://instagram.com/${shop.seller?.instagram}`)}
                className="flex items-center gap-2 px-3 py-2 bg-white/50 backdrop-blur-sm rounded-lg hover:bg-blue-100 transition"
              >
                <Instagram className="w-4 h-4 text-blue-900" /> Instagram
              </button>
            )}
            {shop.seller?.tiktok && (
              <button
                onClick={() => handleSocialClick(`https://tiktok.com/@${shop.seller?.tiktok}`)}
                className="flex items-center gap-2 px-3 py-2 bg-white/50 backdrop-blur-sm rounded-lg hover:bg-blue-100 transition"
              >
                <Facebook className="w-4 h-4 text-blue-900" /> Tiktok
              </button>
            )}
          </div>

          {/* Action Buttons */}
          <div className="flex gap-2">
            <button
              onClick={handleFollowClick}
              className={`flex-1 px-4 py-2 rounded-lg transition-colors ${shop.isFollowed
                ? "bg-gray-100 text-gray-700"
                : "bg-blue-600 text-white"
                }`}
            >
              {shop.isFollowed ? "Following" : "Follow Shop"}
            </button>
            <button
              onClick={handleContactShop}
              className="px-4 py-2 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
            >
              <ExternalLink className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>

      {/* Shop Products */}
      <div className="p-4">
        <h3 className="mb-4 text-blue-900 font-medium">Products ({shopProducts.length})</h3>
        {shopProducts.length === 0 ? (
          <EmptyState icon="📭" title="No products yet" description="This shop hasn't listed any products" />
        ) : (

          <div className="grid grid-cols-2 gap-3">
            {shopProducts.map((product) => (
              <div key={product.id} className="transition hover:scale-[1.02]">
                {/* Removed console.log to fix the error */}
                <Productdisplay product={product} onClick={() => onProductSelect(product.id)} />
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Report Modal */}
      {showReportModal && (
        <ReportShopModal
          shopName={shop.shopName}
          onClose={() => setShowReportModal(false)}
          onSubmit={handleReportSubmit}
        />
      )}
    </div>
  );
}