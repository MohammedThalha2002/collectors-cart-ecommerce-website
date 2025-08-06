import React, { useState, useEffect } from "react";
import {
  getUserWishlist,
  removeFromWishlist,
} from "../../services/profileService";
import { showToast } from "../shared/others/showToast";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";

const MyWishlist = () => {
  const [wishlistItems, setWishlistItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [removingItems, setRemovingItems] = useState(new Set());
  const navigate = useNavigate();

  useEffect(() => {
    fetchWishlist();
  }, []);

  const fetchWishlist = async () => {
    try {
      setLoading(true);
      const data = await getUserWishlist();
      setWishlistItems(data.wishlist || []);
    } catch (error) {
      console.error("Error fetching wishlist:", error);
      showToast(toast, "error", "Failed to fetch wishlist");
    } finally {
      setLoading(false);
    }
  };

  const handleRemoveFromWishlist = async (productId) => {
    try {
      setRemovingItems((prev) => new Set(prev).add(productId));
      await removeFromWishlist(productId);
      setWishlistItems((prev) =>
        prev.filter((item) => item.Product.id !== productId)
      );
      showToast(toast, "success", "Item removed from wishlist");
    } catch (error) {
      console.error("Error removing from wishlist:", error);
      showToast(toast, "error", "Failed to remove item from wishlist");
    } finally {
      setRemovingItems((prev) => {
        const newSet = new Set(prev);
        newSet.delete(productId);
        return newSet;
      });
    }
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(amount);
  };

  const formatDate = (dateString) => {
    const options = {
      year: "numeric",
      month: "short",
      day: "numeric",
    };
    return new Date(dateString).toLocaleDateString("en-US", options);
  };

  const getDiscountPercentage = (originalPrice, discountPrice) => {
    if (!discountPrice || discountPrice >= originalPrice) return 0;
    return Math.round(((originalPrice - discountPrice) / originalPrice) * 100);
  };

  const handleViewProduct = (productId) => {
    navigate(`/product/${productId}`);
  };

  const handleClearWishlist = async () => {
    if (
      window.confirm("Are you sure you want to clear your entire wishlist?")
    ) {
      try {
        for (const item of wishlistItems) {
          await removeFromWishlist(item.Product.id);
        }
        setWishlistItems([]);
        showToast(toast, "success", "Wishlist cleared successfully");
      } catch (error) {
        console.error("Error clearing wishlist:", error);
        showToast(toast, "error", "Failed to clear wishlist");
      }
    }
  };

  if (loading) {
    return (
      <div className="p-8">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-300 rounded w-1/4 mb-4"></div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {[...Array(8)].map((_, i) => (
              <div key={i} className="h-80 bg-gray-300 rounded-xl"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h2 className="text-3xl font-bold text-gray-800 mb-2">My Wishlist</h2>
          <p className="text-gray-600">
            {wishlistItems.length}{" "}
            {wishlistItems.length === 1 ? "item" : "items"} saved for later
          </p>
        </div>
        <div className="flex items-center space-x-4">
          {/* Clear Wishlist */}
          {wishlistItems.length > 0 && (
            <button
              onClick={handleClearWishlist}
              className="px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded-lg font-semibold transition-colors text-sm"
            >
              <i className="fas fa-trash mr-2"></i>
              Clear All
            </button>
          )}
        </div>
      </div>

      {/* Wishlist Items */}
      {wishlistItems.length === 0 ? (
        <div className="text-center py-12">
          <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <i className="fas fa-heart text-gray-400 text-3xl"></i>
          </div>
          <h3 className="text-xl font-semibold text-gray-800 mb-2">
            Your wishlist is empty
          </h3>
          <p className="text-gray-600 mb-6">
            Start adding items to your wishlist to see them here
          </p>
          <button
            onClick={() => navigate("/collections")}
            className="bg-pink-500 hover:bg-pink-600 text-white px-6 py-3 rounded-lg font-semibold transition-colors"
          >
            <i className="fas fa-shopping-bag mr-2"></i>
            Browse Products
          </button>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mb-8">
            {wishlistItems.map((item) => (
              <div
                key={item.id}
                className="bg-white rounded-xl border border-gray-200 overflow-hidden hover:shadow-lg transition-all duration-300 transform hover:scale-105"
              >
                <div className="relative">
                  <img
                    src={
                      import.meta.env.VITE_IMAGE_URL + item.Product?.images?.[0]
                    }
                    alt={item.Product?.name}
                    className="w-full h-48 object-cover"
                  />

                  {/* Remove Button */}
                  <button
                    onClick={() => handleRemoveFromWishlist(item.Product.id)}
                    disabled={removingItems.has(item.Product.id)}
                    className="absolute top-3 right-3 w-8 h-8 bg-white hover:bg-red-50 text-red-500 hover:text-red-600 rounded-full flex items-center justify-center shadow-md transition-colors disabled:opacity-50"
                  >
                    {removingItems.has(item.Product.id) ? (
                      <div className="animate-spin rounded-full h-4 w-4 border-2 border-red-500 border-t-transparent"></div>
                    ) : (
                      <i className="fas fa-times text-sm"></i>
                    )}
                  </button>
                </div>

                <div className="p-4">
                  <div className="mb-2">
                    <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded-full">
                      {item.Product?.Category?.name}
                    </span>
                  </div>

                  <h3 className="font-semibold text-gray-800 mb-2 line-clamp-2">
                    {item.Product?.name}
                  </h3>

                  <div className="text-xs text-gray-500 mb-3 line-clamp-2">
                    {item.Product.description}
                  </div>

                  <button
                    onClick={() => {
                      // Add to cart functionality would go here
                      showToast(
                        toast,
                        "info",
                        "Add to cart functionality coming soon!"
                      );
                    }}
                    className="w-full bg-gray-800 hover:bg-gray-900 text-white py-2 px-3 rounded-lg font-semibold transition-colors text-sm"
                  >
                    <i className="fas fa-shopping-cart mr-1"></i>
                    Add
                  </button>
                </div>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
};

export default MyWishlist;
