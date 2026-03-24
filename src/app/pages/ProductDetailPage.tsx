"use client";

import { useEffect, useState, useCallback } from "react";
import { ArrowLeft, ArrowRight, Bookmark, ExternalLink, Star } from "lucide-react";
import { StarRating } from "../components/StarRating";
import { ReviewCard } from "../components/ReviewCard";
import { ImageWithFallback } from "../components/figma/ImageWithFallback";
import { useAppContext } from "../contexts/AppContext";
import { getProductDetails } from "../services/productsApi";
import React from "react";
import { saveProduct, unsaveProduct } from "../services/savedApi";
import { getReviewsByProduct } from "../services/reviewApi";
import { trackContactClick, trackShopView } from "../services/engagementApi";
import { getShopById } from "../services/shopsApi";

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

  const [product, setProduct] = useState<any | null>(null);
  const [shop, setShop] = useState<any | null>(null);
  const [reviews, setReviews] = useState<any[]>([]);
  const [visibleReviewsCount, setVisibleReviewsCount] = useState(3); // ✅ Show first 3 reviews initially

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [saving, setSaving] = useState(false);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);

  const fetchProductData = useCallback(async (showLoader = false) => {
    try {
      if (showLoader) setLoading(true);

      const [fetchedProduct, fetchedReviews] = await Promise.all([
        getProductDetails(productId),
        getReviewsByProduct(productId),
      ]);

      const fetchedShop = await getShopById(fetchedProduct.shop.id);

      setProduct(fetchedProduct);
      setShop(fetchedShop);
      setReviews(fetchedReviews);

      setError(null);
    } catch (err: any) {
      console.error(err);
      setError(err.message || "Failed to load product");
    } finally {
      if (showLoader) setLoading(false);
    }
  }, [productId]);

  useEffect(() => {
    fetchProductData(true);
  }, [fetchProductData]);

  useEffect(() => {
    const interval = setInterval(() => {
      fetchProductData(false);
    }, 30000);
    return () => clearInterval(interval);
  }, [fetchProductData]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-white to-blue-100">
        <div className="w-10 h-10 border-4 border-blue-900 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  if (error)
    return <div className="p-4 text-center text-red-500">Error: {error}</div>;

  if (!product || !shop)
    return <div className="p-4 text-center">Product not found</div>;

  const handleContactSeller = () => {
    if (shop?.seller?.user?.telegramId) {
      trackContactClick(shop.id).catch(() => {});
      window.open(`https://t.me/${shop.seller.user.telegramId}`, "_blank");
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

  const handleViewShop = async () => {
    try {
      trackShopView(shop.id).catch(() => {});
    } catch (err) {
      console.error(err);
    }
    onViewShop(shop.id);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-100 pb-20">

      {/* Header */}
      <div className="sticky top-0 z-20 backdrop-blur-lg bg-white/70 border-b border-white/40 shadow-sm">
        <div className="px-4 py-3 flex justify-between items-center">
          <button onClick={onBack}>
            <ArrowLeft className="w-5 h-5 text-gray-700" />
          </button>

          <button onClick={handleSaveProduct} disabled={saving}>
            <Bookmark
              className={`w-5 h-5 transition ${
                isSaved(productId)
                  ? "fill-blue-600 text-blue-600"
                  : "text-gray-700"
              }`}
            />
          </button>
        </div>
      </div>

      {/* Product Section */}
      <div className="mt-3 mx-3 p-4 flex flex-col md:flex-row gap-4 
        rounded-2xl bg-white/80 backdrop-blur-md border border-white/40 shadow-sm">

        {/* Images */}
        <div className="md:w-1/2 flex flex-col gap-2">

          {/* Main Image */}
          <div className="w-full aspect-square">
            <ImageWithFallback
              src={
                product.images[selectedImageIndex]?.imagePath?.startsWith("http")
                  ? product.images[selectedImageIndex].imagePath
                  : `https://backend-ikou.onrender.com${product.images[selectedImageIndex].imagePath}`
              }
              alt={product.name}
              className="w-full h-full object-cover rounded-2xl"
            />
          </div>

          {/* Thumbnails */}
          {product.images.length > 1 && (
            <div className="flex gap-2 overflow-x-auto mt-2">
              {product.images.map((img: any, index: number) => (
                <button
                  key={index}
                  onClick={() => setSelectedImageIndex(index)}
                  className={`border rounded-lg overflow-hidden ${
                    index === selectedImageIndex
                      ? "border-blue-600"
                      : "border-gray-300"
                  }`}
                >
                  <ImageWithFallback
                    src={
                      img.imagePath?.startsWith("http")
                        ? img.imagePath
                        : `https://backend-ikou.onrender.com${img.imagePath}`
                    }
                    alt={`${product.name} ${index}`}
                    className="w-20 h-20 object-cover"
                  />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Info */}
        <div className="md:w-1/2 flex flex-col justify-between">
          <div>
            <h1 className="text-2xl font-semibold text-gray-800">
              {product.name}
            </h1>

            <div className="flex items-center gap-2 mt-2">
              <StarRating rating={product.ratingAverage} />
              <span className="text-sm text-gray-600">
                {product.ratingAverage} ({product.ratingCount})
              </span>
            </div>

            <p className="text-blue-900 text-xl mt-4 font-semibold">
              ${product.price}
            </p>

            <p className="mt-3 text-gray-700 text-sm leading-relaxed">
              {product.description}
            </p>
          </div>
        </div>
      </div>

      {/* Reviews */}
      <div className="mt-3 mx-3 p-4 rounded-2xl 
        bg-white/80 backdrop-blur-md border border-white/40 shadow-sm">

        <div className="flex justify-between items-center">
          <h3 className="font-semibold text-gray-800">
            Reviews ({reviews.length})
          </h3>

          <button
            onClick={() => onWriteReview(productId, shop.id, product.name)}
            className="text-blue-900 text-sm hover:text-black transition-colors"
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
            {reviews.slice(0, visibleReviewsCount).map((review, index) => (
              <ReviewCard 
                key={index} 
                review={review}
                productRatingAverage={product.ratingAverage}
                productRatingCount={reviews.length}
              />
            ))}

            {reviews.length > visibleReviewsCount && (
              <div className="text-center mt-2">
                <button
                  onClick={() => setVisibleReviewsCount(reviews.length)}
                  className="text-blue-600 hover:underline text-sm"
                >
                  See All Reviews ({reviews.length})
                </button>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Shop */}
      <div className="mt-3 mx-3 p-4 rounded-2xl 
        bg-blue-50/60 backdrop-blur-md border border-blue-100 shadow-sm">

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

        {/* View Shop */}
        <div
          onClick={handleViewShop}
          className="flex items-center justify-between mt-4 cursor-pointer group"
        >
          <span className="text-blue-600 font-medium">
            View Shop
          </span>

          <ArrowRight className="w-5 h-5 text-blue-600 transition-transform group-hover:translate-x-1" />
        </div>

        {/* Contact */}
        <button
          onClick={handleContactSeller}
          className="w-full mt-4 bg-blue-900 hover:bg-blue-800 text-white py-3 rounded-lg flex justify-center items-center gap-2 transition"
        >
          <ExternalLink className="w-5 h-5" />
          Contact Seller
        </button>
      </div>

    </div>
  );
}