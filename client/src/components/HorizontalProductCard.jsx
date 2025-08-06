import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import {
  addToWishlist,
  removeFromWishlist,
  checkWishlistStatus,
} from "../services/profileService";
import { showToast } from "./shared/others/showToast";
import { toast } from "react-toastify";

function HorizontalProductCard({
  productId,
  imageUrl,
  name,
  tag,
  category,
  subCategory,
  description,
  price,
  addToCart,
  showDateDialog,
  isBirthdayNote = false,
}) {
  const [isInWishlist, setIsInWishlist] = useState(false);
  const [wishlistLoading, setWishlistLoading] = useState(false);
  const [authenticated, setAuthenticated] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("jwt-token");
    setAuthenticated(!!token);

    if (token && productId) {
      checkWishlistStatus(productId)
        .then((response) => {
          setIsInWishlist(response.isInWishlist);
        })
        .catch((error) => {
          // Silent fail for wishlist status check
          console.log("Could not check wishlist status:", error);
        });
    }
  }, [productId]);

  const handleWishlistToggle = async (e) => {
    e.preventDefault();
    e.stopPropagation();

    if (!authenticated) {
      showToast(toast, "error", "Please log in to add items to wishlist");
      return;
    }

    setWishlistLoading(true);
    try {
      if (isInWishlist) {
        await removeFromWishlist(productId);
        setIsInWishlist(false);
        showToast(toast, "success", "Removed from wishlist");
      } else {
        await addToWishlist(productId);
        setIsInWishlist(true);
        showToast(toast, "success", "Added to wishlist");
      }
    } catch (error) {
      console.error("Error toggling wishlist:", error);
      showToast(toast, "error", "Failed to update wishlist");
    } finally {
      setWishlistLoading(false);
    }
  };
  return (
    <div
      key={productId}
      className="bg-white rounded-lg shadow-md overflow-hidden group cursor-pointer"
    >
      <Link
        to={"/collections/" + productId}
        className="flex flex-col md:flex-row"
      >
        <div className="md:w-1/4 relative">
          <div className="h-64 md:h-full overflow-hidden">
            <img
              src={import.meta.env.VITE_IMAGE_URL + imageUrl}
              alt={name}
              className="w-full h-full object-cover object-top group-hover:scale-105 transition-transform duration-300"
            />
          </div>
          <div className="absolute top-3 left-3">
            <span
              className={`text-white text-xs px-2 py-1 rounded-full bg-gray-700`}
            >
              {tag}
            </span>
          </div>
          <div className="absolute top-3 right-3">
            <button
              onClick={handleWishlistToggle}
              disabled={wishlistLoading}
              className={`w-8 h-8 rounded-full shadow-md flex items-center justify-center transition-all duration-300 cursor-pointer ${
                isInWishlist
                  ? "bg-gold text-white hover:bg-gold/90"
                  : "bg-white text-gray-600 hover:text-gold hover:bg-gold/10"
              } ${wishlistLoading ? "opacity-50 cursor-not-allowed" : ""}`}
            >
              {wishlistLoading ? (
                <div className="animate-spin rounded-full h-4 w-4 border-2 border-current border-t-transparent"></div>
              ) : (
                <i
                  className={`fas fa-heart text-sm ${
                    isInWishlist ? "text-white" : ""
                  }`}
                ></i>
              )}
            </button>
          </div>
        </div>
        <div className="md:w-3/4 p-6">
          <div className="flex flex-col md:flex-row md:justify-between md:items-start">
            <div>
              <p className="text-sm text-gray-500">{subCategory.name}</p>
              <h3 className="text-xl font-medium mb-2">{name}</h3>
              <div className="flex items-center space-x-4 mb-4">
                <span className="text-sm bg-gray-100 px-2 py-1 rounded">
                  {category.name}
                </span>
              </div>
              <p className="text-gray-600 mb-4">{description}</p>
            </div>
            <div className="mt-4 md:mt-0 md:ml-6 h-32 flex flex-col items-end justify-between">
              <div className="text-gold font-semibold text-xl mb-2">
                ₹{price.toLocaleString()}
              </div>
              <button
                onClick={(e) => {
                  e.preventDefault();
                  if (isBirthdayNote) {
                    showDateDialog();
                  } else {
                    addToCart();
                  }
                }}
                className="px-6 py-2 bg-gold text-white hover:bg-gold/90 transition-colors rounded-lg whitespace-nowrap cursor-pointer"
              >
                Add to Cart
              </button>
            </div>
          </div>
        </div>
      </Link>
    </div>
  );
}

export default HorizontalProductCard;
