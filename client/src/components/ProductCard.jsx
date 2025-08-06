import React, { useState, useEffect } from "react";
import {
  addToWishlist,
  removeFromWishlist,
  checkWishlistStatus,
} from "../services/profileService";
import { showToast } from "./shared/others/showToast";
import { toast } from "react-toastify";

function ProductCard({
  id,
  imageUrl,
  tag,
  name,
  description,
  price,
  addToCart,
  onClick,
  showDateDialog,
  isBirthdayNote = false,
}) {
  const [isInWishlist, setIsInWishlist] = useState(false);
  const [wishlistLoading, setWishlistLoading] = useState(false);
  const [authenticated, setAuthenticated] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("jwt-token");
    setAuthenticated(!!token);

    if (token && id) {
      checkWishlistStatus(id)
        .then((response) => {
          setIsInWishlist(response.isInWishlist);
        })
        .catch((error) => {
          // Silent fail for wishlist status check
          console.log("Could not check wishlist status:", error);
        });
    }
  }, [id]);

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
        await removeFromWishlist(id);
        setIsInWishlist(false);
        showToast(toast, "success", "Removed from wishlist");
      } else {
        await addToWishlist(id);
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
    <div className="bg-white rounded-lg shadow-md overflow-hidden group h-[470px] flex flex-col cursor-pointer">
      <div onClick={onClick} className="relative">
        <div className="h-64 overflow-hidden">
          <img
            src={imageUrl}
            alt={name}
            className="w-full h-full object-cover object-top group-hover:scale-105 transition-transform duration-300"
          />
        </div>
        <div className="absolute top-3 left-3">
          <span className="bg-gray-700 text-white text-xs px-2 py-1 rounded-full">
            {tag}
          </span>
        </div>
        <div className="absolute top-3 right-3 flex space-x-2">
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
          <button className="w-8 h-8 rounded-full bg-white shadow-md flex items-center justify-center hover:text-gold transition-colors cursor-pointer">
            <i className="far fa-eye"></i>
          </button>
        </div>
      </div>

      {/* Content and Button */}
      <div className="p-4 flex flex-col justify-between flex-1">
        <div onClick={onClick} className="mb-4">
          <div className="flex justify-between items-start mb-2">
            <h3 className="font-medium text-sm line-clamp-1">{name}</h3>
            <div className="text-gold font-semibold text-sm">
              ₹{price.toLocaleString()}
            </div>
          </div>
          <p className="text-sm text-gray-600 line-clamp-3">{description}</p>
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
          className="w-full py-2 bg-gold text-white hover:bg-gold/90 transition-colors rounded-lg whitespace-nowrap cursor-pointer"
        >
          Add to Cart
        </button>
      </div>
    </div>
  );
}

export default ProductCard;
