import User from "../../model/user.js";
import Order from "../../model/order.js";
import OrderItem from "../../model/orderItem.js";
import Product from "../../model/product.js";
import Category from "../../model/category.js";
import SubCategory from "../../model/subCategory.js";
import Wishlist from "../../model/wishlist.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
dotenv.config();

/**
 * Get user profile information
 */
export const getUserProfile = async (req, res) => {
  try {
    const userId = req.user.id;

    const user = await User.findByPk(userId, {
      attributes: { exclude: ["password"] },
    });

    if (!user) {
      return res.status(404).json({ error: { message: "User not found" } });
    }

    res.json(user);
  } catch (error) {
    console.error("Error fetching user profile:", error);
    res.status(500).json({ error: { message: "Internal server error" } });
  }
};

/**
 * Update user profile information
 */
export const updateUserProfile = async (req, res) => {
  try {
    const userId = req.user.id;
    const { name, phone, address, city, state, pincode, dateOfBirth } =
      req.body;

    const user = await User.findByPk(userId);
    if (!user) {
      return res.status(404).json({ error: { message: "User not found" } });
    }

    await user.update({
      name,
      phone,
      address,
      city,
      state,
      pincode,
      dateOfBirth: dateOfBirth ? new Date(dateOfBirth) : null,
    });

    const updatedUser = await User.findByPk(userId, {
      attributes: { exclude: ["password"] },
    });

    res.json({
      message: "Profile updated successfully",
      user: updatedUser,
    });
  } catch (error) {
    console.error("Error updating user profile:", error);
    res.status(500).json({ error: { message: "Internal server error" } });
  }
};

/**
 * Change user password
 */
export const changePassword = async (req, res) => {
  try {
    const userId = req.user.id;
    const { currentPassword, newPassword } = req.body;

    // Validate input
    if (!currentPassword || !newPassword) {
      return res.status(400).json({
        error: { message: "Current password and new password are required" },
      });
    }

    if (newPassword.length < 6) {
      return res.status(400).json({
        error: { message: "New password must be at least 6 characters long" },
      });
    }

    const user = await User.findByPk(userId);
    if (!user) {
      return res.status(404).json({ error: { message: "User not found" } });
    }

    // Verify current password
    const isCurrentPasswordValid = await bcrypt.compare(
      currentPassword,
      user.password
    );
    if (!isCurrentPasswordValid) {
      return res.status(400).json({
        error: { message: "Current password is incorrect" },
      });
    }

    // Hash new password
    const hashedNewPassword = await bcrypt.hash(newPassword, 10);

    // Update password
    await user.update({ password: hashedNewPassword });

    res.json({ message: "Password changed successfully" });
  } catch (error) {
    console.error("Error changing password:", error);
    res.status(500).json({ error: { message: "Internal server error" } });
  }
};

/**
 * Get user orders
 */
export const getUserOrders = async (req, res) => {
  try {
    const userId = req.user.id;
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const offset = (page - 1) * limit;

    const { count, rows: orders } = await Order.findAndCountAll({
      where: { userId },
      include: [
        {
          model: OrderItem,
          include: [
            {
              model: Product,
              include: [{ model: Category }, { model: SubCategory }],
            },
          ],
        },
      ],
      order: [["createdAt", "DESC"]],
      limit,
      offset,
    });

    const totalPages = Math.ceil(count / limit);

    res.json({
      orders,
      meta: {
        total: count,
        page,
        limit,
        totalPages,
      },
    });
  } catch (error) {
    console.error("Error fetching user orders:", error);
    res.status(500).json({ error: { message: "Internal server error" } });
  }
};

/**
 * Get user wishlist
 */
export const getUserWishlist = async (req, res) => {
  try {
    const userId = req.user.id;

    const wishlistItems = await Wishlist.findAll({
      where: { userId },
      include: [
        {
          model: Product,
          include: [{ model: Category }, { model: SubCategory }],
        },
      ],
      exclude: ["notifyUserIds", "costPrice"],
      order: [["createdAt", "DESC"]],
    });

    res.json({
      wishlist: wishlistItems,
    });
  } catch (error) {
    console.error("Error fetching user wishlist:", error);
    res.status(500).json({ error: { message: "Internal server error" } });
  }
};

/**
 * Add item to wishlist
 */
export const addToWishlist = async (req, res) => {
  try {
    const userId = req.user.id;
    const { productId } = req.body;

    if (!productId) {
      return res.status(400).json({
        error: { message: "Product ID is required" },
      });
    }

    // Check if product exists
    const product = await Product.findByPk(productId);
    if (!product) {
      return res.status(404).json({
        error: { message: "Product not found" },
      });
    }

    // Check if already in wishlist
    const existingWishlistItem = await Wishlist.findOne({
      where: { userId, productId },
    });

    if (existingWishlistItem) {
      return res.status(400).json({
        error: { message: "Product already in wishlist" },
      });
    }

    // Add to wishlist
    const wishlistItem = await Wishlist.create({ userId, productId });

    const wishlistItemWithProduct = await Wishlist.findByPk(wishlistItem.id, {
      include: [
        {
          model: Product,
          include: [{ model: Category }, { model: SubCategory }],
        },
      ],
    });

    res.json({
      message: "Product added to wishlist successfully",
      wishlistItem: wishlistItemWithProduct,
    });
  } catch (error) {
    console.error("Error adding to wishlist:", error);
    res.status(500).json({ error: { message: "Internal server error" } });
  }
};

/**
 * Remove item from wishlist
 */
export const removeFromWishlist = async (req, res) => {
  try {
    const userId = req.user.id;
    const { productId } = req.params;

    const wishlistItem = await Wishlist.findOne({
      where: { userId, productId },
    });

    if (!wishlistItem) {
      return res.status(404).json({
        error: { message: "Item not found in wishlist" },
      });
    }

    await wishlistItem.destroy();

    res.json({ message: "Product removed from wishlist successfully" });
  } catch (error) {
    console.error("Error removing from wishlist:", error);
    res.status(500).json({ error: { message: "Internal server error" } });
  }
};

/**
 * Check if product is in user's wishlist
 */
export const checkWishlistStatus = async (req, res) => {
  try {
    const userId = req.user.id;
    const { productId } = req.params;

    const wishlistItem = await Wishlist.findOne({
      where: { userId, productId },
    });

    res.json({ isInWishlist: !!wishlistItem });
  } catch (error) {
    console.error("Error checking wishlist status:", error);
    res.status(500).json({ error: { message: "Internal server error" } });
  }
};
