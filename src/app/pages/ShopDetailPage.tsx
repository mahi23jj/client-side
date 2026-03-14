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

        // Transform API products to ProductCard format
        const mappedProducts: ProductCardProduct[] = shopData.products.map((p: any) => ({
          id: p.id,
          name: p.name,
          price: p.price,
          description: "",
          image: p.images?.[0]?.imagePath || "/placeholder-image.png",
          shopId: shopData.id,
          shopName: shopData.shopName,
          rating: Number(p.ratingAverage ?? 0),     // ✅ map to `rating`
  reviewCount: Number(p.reviewCount ?? 0),  // ✅ map to `reviewCount`
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

  if (loading) return <div className="p-4">Loading shop...</div>;
  if (error) return <div className="p-4 text-red-500">{error}</div>;
  if (!shop) return <div className="p-4">Shop not found</div>;

  const handleContactShop = () => {
    window.open(`https://t.me/${shop.seller.user.telegramId}`, "_blank");
  };

  const handleFollowClick = async () => {
    if (!shop) return;

    try {
      await toggleFollowShopApi(shopId);

      // Update local context
      toggleFollowLocal(shopId);

      // Update shop followers count locally
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
// Track social media click and open link
  const handleSocialClick = (url: string) => {
    if (!url) return;
  
    // send engagement event (do not block UI)
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

  const yearsActive = 0; // optional

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 sticky top-0 z-10">
        <div className="px-4 py-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <button onClick={onBack} className="p-1 hover:bg-gray-100 rounded-lg">
                <ArrowLeft className="w-5 h-5" />
              </button>
              <h1 className="text-lg">Shop Details</h1>
            </div>
            <button
              onClick={() => setShowReportModal(true)}
              className="p-1 hover:bg-gray-100 rounded-lg"
              title="Report shop"
            >
              <Flag className="w-5 h-5 text-gray-600" />
            </button>
          </div>
        </div>
      </div>

      {/* Shop Info */}
      <div className="bg-white p-4 border-b border-gray-200">
        <div className="flex items-start justify-between mb-3">
          <div className="flex-1">
            <h2 className="mb-2">{shop.shopName}</h2>
            <p className="text-sm text-gray-700 mb-3">{shop.bio}</p>

            {/* Trust Indicators */}
            <div className="flex flex-wrap gap-4 text-sm text-gray-600">
              <div className="flex items-center gap-1">
                <Users className="w-4 h-4" />
                <span>{shop.followersCount} followers</span>
              </div>
              <div className="flex items-center gap-1">
                <Calendar className="w-4 h-4" />
                <span>
                  {yearsActive > 0 ? `${yearsActive}+ years` : "New shop"}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Social Media Links */}
        {(shop.seller.instagram || shop.seller.tiktok) && (
          <div className="flex gap-2 mb-4">
            {shop.seller.instagram && (
              <button
              onClick={() =>
                handleSocialClick(`https://instagram.com/${shop.seller.instagram}`)
              }
              className="flex items-center gap-2 px-3 py-2 bg-gray-100 rounded-lg text-sm hover:bg-gray-200 transition-colors"
            >
              <Instagram className="w-4 h-4" />
              Instagram
            </button>
            )}
            {shop.seller.tiktok && (
              <button
              onClick={() =>
                handleSocialClick(`https://tiktok.com/@${shop.seller.tiktok}`)
              }
              className="flex items-center gap-2 px-3 py-2 bg-gray-100 rounded-lg text-sm hover:bg-gray-200 transition-colors"
            >
              <Facebook className="w-4 h-4" />
              Tiktok
            </button>
            )}
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex gap-2">
          <button
            onClick={handleFollowClick}
            className={`flex-1 px-4 py-2 rounded-lg transition-colors ${
              isFollowing(shopId)
                ? "bg-gray-100 text-gray-700"
                : "bg-blue-600 text-white"
            }`}
          >
            {isFollowing(shopId) ? "Following" : "Follow Shop"}
          </button>
          <button
            onClick={handleContactShop}
            className="px-4 py-2 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
          >
            <ExternalLink className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Shop Products */}
      <div className="p-4">
        <h3 className="mb-4">Products ({shopProducts.length})</h3>

        {shopProducts.length === 0 ? (
          <EmptyState
            icon="📭"
            title="No products yet"
            description="This shop hasn't listed any products"
          />
        ) : (
          <div className="grid grid-cols-2 gap-3">
            {shopProducts.map((product) => (
              <Productdisplay
                key={product.id}
                product={product}
                onClick={() => onProductSelect(product.id)}
              />
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