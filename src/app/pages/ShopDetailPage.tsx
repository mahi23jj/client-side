"use client";

import { useEffect, useState } from "react";
import { ArrowLeft, ExternalLink, Instagram, Facebook, Calendar, Users, Flag } from "lucide-react";
import { EmptyState } from "../components/EmptyState";
import { ReportShopModal } from "../components/ReportShopModal";
import { useAppContext } from "../contexts/AppContext";
import React from "react";
import { getShopById } from "../services/shopsApi";
import { ProductCardProduct, Shop } from "../../types/api";
import { reportShop } from "../services/reportApi";
import { toggleFollowShopApi } from "../services/followApi";
import { Productdisplay } from "../components/RatingStars";
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
  const { isFollowing, toggleFollowShop: toggleFollowLocal } = useAppContext();
  const [showReportModal, setShowReportModal] = useState(false);
  const [shop, setShop] = useState<Shop | null>(null);
  const [shopProducts, setShopProducts] = useState<ProductCardProduct[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      setError(null);
      try {
        const shopData = await getShopById(shopId);
        setShop(shopData);

        const mappedProducts: ProductCardProduct[] = shopData.products.map((p: any) => ({
          id: p.id,
          name: p.name,
          price: p.price,
          description: "",
          image: p.images?.[0]?.imagePath || "/placeholder-image.png",
          shopId: shopData.id,
          shopName: shopData.shopName,
          rating: Number(p.ratingAverage ?? 0),
          reviewCount: Number(p.reviewCount ?? 0),
        }));
        setShopProducts(mappedProducts);
      } catch (err) {
        console.error(err);
        setError("Failed to load shop data.");
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [shopId]);

  const handleContactShop = () => {
    window.open(`https://t.me/${shop?.seller.user.telegramId}`, "_blank");
  };

  const handleFollowClick = async () => {
    if (!shop) return;
    try {
      await toggleFollowShopApi(shopId);
      toggleFollowLocal(shopId);
      setShop({
        ...shop,
        followersCount: isFollowing(shopId)
          ? shop.followersCount - 1
          : shop.followersCount + 1,
      });
    } catch (err: any) {
      alert(err.message);
    }
  };

  const handleSocialClick = (url: string) => {
    if (!url) return;
    trackSocialMediaClick(shopId).catch(() => {});
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

  if (loading) return <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-100"><div className="w-12 h-12 border-4 border-blue-900 border-t-transparent rounded-full animate-spin"></div></div>;
  if (error) return <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-100 text-red-600">{error}</div>;
  if (!shop) return <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-100">Shop not found</div>;

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-100">

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
            {shop.seller.instagram && (
              <button
                onClick={() => handleSocialClick(`https://instagram.com/${shop.seller.instagram}`)}
                className="flex items-center gap-2 px-3 py-2 bg-white/50 backdrop-blur-sm rounded-lg hover:bg-blue-100 transition"
              >
                <Instagram className="w-4 h-4 text-blue-900" /> Instagram
              </button>
            )}
            {shop.seller.tiktok && (
              <button
                onClick={() => handleSocialClick(`https://tiktok.com/@${shop.seller.tiktok}`)}
                className="flex items-center gap-2 px-3 py-2 bg-white/50 backdrop-blur-sm rounded-lg hover:bg-blue-100 transition"
              >
                <Facebook className="w-4 h-4 text-blue-900" /> Tiktok
              </button>
            )}
          </div>

          {/* Action Buttons */}
          <div className="flex gap-2 mt-3">
            <button
              onClick={handleFollowClick}
              className={`flex-1 px-4 py-2 rounded-lg transition-colors ${
                isFollowing(shopId) ? "bg-gray-100 text-gray-700" : "bg-blue-900 text-white"
              }`}
            >
              {isFollowing(shopId) ? "Following" : "Follow Shop"}
            </button>
            <button
              onClick={handleContactShop}
              className="px-4 py-2 bg-white/50 backdrop-blur-sm rounded-lg hover:bg-blue-100 transition"
            >
              <ExternalLink className="w-5 h-5 text-blue-900" />
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