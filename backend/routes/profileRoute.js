import express from "express";
import { userValidate } from "../middleware/validation.js";
import {
  getUserProfile,
  updateUserProfile,
  changePassword,
  getUserOrders,
  getUserWishlist,
  addToWishlist,
  removeFromWishlist,
  checkWishlistStatus,
} from "../controller/profile/profileController.js";

const router = express.Router();

// Profile routes - all require user authentication
router.get("/profile", userValidate, getUserProfile);
router.put("/profile", userValidate, updateUserProfile);
router.post("/profile/change-password", userValidate, changePassword);

// Orders routes
router.get("/profile/orders", userValidate, getUserOrders);

// Wishlist routes
router.get("/profile/wishlist", userValidate, getUserWishlist);
router.post("/profile/wishlist", userValidate, addToWishlist);
router.delete("/profile/wishlist/:productId", userValidate, removeFromWishlist);
router.get(
  "/profile/wishlist/check/:productId",
  userValidate,
  checkWishlistStatus
);

export default router;
