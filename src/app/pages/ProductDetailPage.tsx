import { useEffect, useState } from "react";
import { ArrowLeft, Bookmark, ExternalLink, Star } from "lucide-react";
import { StarRating } from "../components/StarRating";
import { ReviewCard } from "../components/ReviewCard";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import { ImageWithFallback } from "../components/figma/ImageWithFallback";
import { useAppContext } from "../contexts/AppContext";
import React from "react";
import { saveProduct, unsaveProduct } from "../services/savedApi";
import { getReviewsByProduct } from "../services/reviewApi";
import { useProductDetail } from "../../hooks/useMarketplaceQueries";

interface ProductDetailPageProps {
  productId: string;
  onBack: () => void;
  onViewShop: (shopId: string) => void;
  onWriteReview: (
    productId: string,
    shopId: string,
    productName?: string
  ) => void;
}

export function ProductDetailPage({
  productId,
  onBack,
  onViewShop,
  onWriteReview,
}: ProductDetailPageProps) {
  const { isSaved, toggleSavedProduct } = useAppContext();

  const { data: product, isLoading, isFetching, error } = useProductDetail(productId);
  const shop = product?.shop ?? null;

  const [reviews, setReviews] = useState<any[]>([]);

  const [saving, setSaving] = useState(false);

  useEffect(() => {
    const fetchReviews = async () => {
      try {
        const fetchedReviews = await getReviewsByProduct(productId);
        setReviews(fetchedReviews);
      } catch (err) {
        console.error("Failed to load reviews", err);
      }
    };

    fetchReviews();
  }, [productId]);

  if (isLoading && !product) {
    return (
      <div className="min-h-screen bg-gray-50 p-4 space-y-3">
        <div className="h-10 w-24 bg-gray-200 rounded animate-pulse" />
        <div className="h-80 bg-gray-200 rounded-xl animate-pulse" />
        <div className="h-24 bg-gray-200 rounded-xl animate-pulse" />
      </div>
    );
  }

  if (error)
    return (
      <div className="p-4 text-center text-red-500">
        Error: {(error as Error).message || "Failed to load product"}
      </div>
    );

  if (!product || !shop)
    return (
      <div className="p-4 text-center">
        Product not found
      </div>
    );

  const sliderSettings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    arrows: false,
  };

  const handleContactSeller = () => {
    if (shop?.seller?.user?.telegramId) {
      window.open(
        `https://t.me/${shop.seller.user.telegramId}`,
        "_blank"
      );
    }
  };

  const handleSaveProduct = async () => {
    if (saving) return;

    setSaving(true);

    try {
      if (isSaved(productId)) {
        await unsaveProduct(productId, shop.id);
      } else {
        await saveProduct(productId, shop.id);
      }

      toggleSavedProduct(productId, shop.id);
    } catch (err: any) {
      alert(err.message || "Failed to save");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      {isFetching && (
        <div className="text-xs text-gray-500 px-4 py-2 bg-white border-b">Refreshing product...</div>
      )}

      {/* Header */}
      <div className="bg-white border-b sticky top-0 z-10">
        <div className="px-4 py-3 flex justify-between">

          <button onClick={onBack} title="Go back" aria-label="Go back">
            <ArrowLeft className="w-5 h-5" />
          </button>

          <button
            onClick={handleSaveProduct}
            disabled={saving}
            title={isSaved(productId) ? "Unsave product" : "Save product"}
            aria-label={isSaved(productId) ? "Unsave product" : "Save product"}
          >
            <Bookmark
              className={`w-5 h-5 ${
                isSaved(productId)
                  ? "fill-blue-600 text-blue-600"
                  : ""
              }`}
            />
          </button>

        </div>
      </div>

      {/* Images */}
      <div className="bg-white">
        <Slider {...sliderSettings}>
          {product.images?.map((img: any, index: number) => (
            <div key={index} className="aspect-square">

              <ImageWithFallback
                src={
                  img.imagePath?.startsWith("http")
                    ? img.imagePath
                    : `https://backend-ikou.onrender.com${img.imagePath}`
                }
                alt={product.name}
                className="w-full h-full object-cover"
              />

            </div>
          ))}
        </Slider>
      </div>

      {/* Info */}
      <div className="bg-white mt-2 p-4">

        <div className="flex justify-between">
          <h1>{product.name}</h1>
          <p className="text-blue-600 text-xl">
            ${product.price}
          </p>
        </div>

        <div className="flex items-center gap-2 mt-2">

          <StarRating rating={product.ratingAverage} />

          <span className="text-sm text-gray-600">
            {product.ratingAverage} ({product.ratingCount})
          </span>

        </div>

        <p className="mt-2 text-sm text-gray-700">
          {product.description}
        </p>

      </div>

      {/* Shop */}
      <div className="bg-white mt-2 p-4">

        <h3>{shop.shopName}</h3>

        <button
          onClick={() => onViewShop(shop.id)}
          className="w-full mt-2 bg-gray-100 py-2 rounded"
        >
          View Shop
        </button>

      </div>

      {/* Reviews */}
      <div className="bg-white mt-2 p-4">

        <div className="flex justify-between">

          <h3>
            Reviews ({reviews.length})
          </h3>

          <button
            onClick={() =>
              onWriteReview(productId, shop.id, product.name)
            }
            className="text-blue-600 text-sm"
          >
            Write Review
          </button>

        </div>

        {reviews.length === 0 ? (

          <div className="text-center py-6 text-gray-400">

            <Star className="mx-auto mb-2" />

            No reviews yet

          </div>

        ) : (

          <div className="space-y-3 mt-3">

            {reviews.map((review, index) => (
              <ReviewCard key={index} review={review} />
            ))}

          </div>

        )}

      </div>

      {/* Bottom Button */}
      <div className="fixed bottom-0 w-full bg-white border-t p-4">

        <button
          onClick={handleContactSeller}
          className="w-full bg-blue-600 text-white py-3 rounded flex justify-center gap-2"
        >

          <ExternalLink className="w-5 h-5" />

          Contact Seller

        </button>

      </div>

    </div>
  );
}