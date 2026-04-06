import express from "express";
import multer from "multer";
import path from "path";
import sharp from "sharp";
import fs from "fs";
import dotenv from "dotenv";
import {
  superAdminValidate,
  checkRole,
  userValidation,
  moderatorValidate,
  adminValidate,
} from "../middleware/validation.js";
dotenv.config();

const router = express.Router();

// IMAGE UPLOAD
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, process.env.IMAGE_UPLOAD_PATH);
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname));
  },
});

const upload = multer({ storage: storage });

router.post("/img-upload", upload.single("image"), async (req, res) => {
  try {
    const tempPath = `${process.env.IMAGE_UPLOAD_PATH}/${req.file.filename}`;
    const watermarkPath = "./template/watermark.png";
    const outputPath = `${process.env.IMAGE_UPLOAD_PATH}/img-${req.file.filename}`;

    const image = sharp(tempPath);
    const metadata = await image.metadata();

    // Load watermark and get its size
    const watermarkSharp = sharp(watermarkPath);
    const watermarkMeta = await watermarkSharp.metadata();

    // Calculate scale ratio to fit watermark inside image
    const scaleRatio = Math.min(
      metadata.width / watermarkMeta.width,
      metadata.height / watermarkMeta.height,
      1 // prevent upscaling
    );

    const resizedWatermarkBuffer = await watermarkSharp
      .resize({
        width: Math.floor(watermarkMeta.width * scaleRatio),
        height: Math.floor(watermarkMeta.height * scaleRatio),
      })
      .png()
      .toBuffer();

    await image
      .composite([
        {
          input: resizedWatermarkBuffer,
        },
      ])
      .toFile(outputPath);

    fs.unlinkSync(tempPath);

    res.send({
      url: outputPath,
    });
  } catch (error) {
    console.error("Watermark error:", error);
    res.status(400).json("Error in uploading or processing the image");
  }
});

// PRODUCT ROUTES
import {
  addProduct,
  addProducts,
  updateProductById,
  getProducts,
  getProductById,
  search,
  deleteProductById,
  deleteMultipleProductsById,
  notifyStockUsers,
} from "../controller/products/productController.js";

router.post("/product", moderatorValidate, addProduct);

router.post("/products", moderatorValidate, addProducts);

router.put("/products/:id", moderatorValidate, updateProductById);

// this checkRole middleware allows the admin to access more data of the product than the user
router.get("/products", checkRole, getProducts);

router.get("/products/:id", getProductById);

router.delete("/products/:id", adminValidate, deleteProductById);

router.delete("/products", adminValidate, deleteMultipleProductsById);

router.get("/searchproducts", search);

router.get("/notify/stock/:id", userValidation, notifyStockUsers);

// category/subCategory routes
import {
  addCategory,
  getAllCategories,
  deleteCategory,
  addSubCategory,
  getSubCategoriesByCategory,
  deleteSubCategory,
  getAllSubCategories,
  getCategoriesWithSubcategoriesAndCounts,
  getCategoryWithProductCount,
  getSubCategoryWithProductCount,
} from "../controller/category/categoryController.js";

// category routes
router.post("/category", adminValidate, addCategory);

router.get("/categories", getAllCategories);

router.get("/categories/with-counts", getCategoriesWithSubcategoriesAndCounts);

router.get("/categories/:categoryId/count", getCategoryWithProductCount);

router.delete("/categories/:id", adminValidate, deleteCategory);

// subcategory routes
router.post("/subcategory", adminValidate, addSubCategory);

router.get("/subcategories/:categoryId", getSubCategoriesByCategory);

router.get("/subcategories", getAllSubCategories);

router.get("/subcategory/:subCategoryId/count", getSubCategoryWithProductCount);

router.delete("/subcategories/:id", adminValidate, deleteSubCategory);

// Orders
import {
  addOrder,
  deleteOrder,
  getOrders,
  getOrderById,
  getOrdersByUsers,
  updateOrderStatus,
  updateTrackingNumber,
  exportOrdersToExcel,
} from "../controller/orders/orderController.js";

router.post("/order", userValidation, addOrder);

router.get("/orders", getOrders);

router.get("/orders/:id", moderatorValidate, getOrderById);

router.put("/orders/:id", moderatorValidate, updateOrderStatus);

router.put("/orders/tracking/:id", moderatorValidate, updateTrackingNumber);

router.delete("/orders/:id", superAdminValidate, deleteOrder);

router.get("/orders/user/info", userValidation, getOrdersByUsers);

router.get("/orders/export/excel", moderatorValidate, exportOrdersToExcel);

// Announcement Routes
import {
  getAnnouncement,
  updateAnnouncement,
  deleteAnnouncement,
} from "../controller/others/announcementController.js";

router.get("/announcement", getAnnouncement);

router.put("/announcement", adminValidate, updateAnnouncement);

router.delete("/announcement", adminValidate, deleteAnnouncement);

// VideoBanner Routes
import {
  getVideoBanner,
  updateVideoBanner,
  deleteVideoBanner,
} from "../controller/others/videoBannerController.js";

router.get("/videobanner", getVideoBanner);

router.put("/videobanner", adminValidate, updateVideoBanner);

router.delete("/videobanner", adminValidate, deleteVideoBanner);

// Subscribers
import {
  subscribe,
  unsubscribe,
  getSubscribers,
} from "../controller/others/subscribersController.js";

router.post("/subscribe", subscribe);

router.post("/unsubscribe", unsubscribe);

router.get("/subscribers", adminValidate, getSubscribers);

// analytics routes
import {
  weeklySalesReport,
  monthlySalesReport,
  yearlySalesReport,
  weeklySalesIncrease,
  frequentlyPurchasedProducts,
} from "../controller/orders/analyticsController.js";
import admin from "../config/firebase.js";

router.get("/analytics/weeklysales", weeklySalesReport);

router.get("/analytics/monthlysales", adminValidate, monthlySalesReport);

router.get("/analytics/yearlysales", adminValidate, yearlySalesReport);

router.get(
  "/analytics/weeklysalespercentage",
  adminValidate,
  weeklySalesIncrease
);

router.get(
  "/analytics/frequentlypurchased",
  adminValidate,
  frequentlyPurchasedProducts
);

// test - notifications

router.get("/test/order-notification", (req, res) => {
  const payload = {
    notification: {
      title: "Order Placed 📦",
      body: "New order has been placed",
    },
    topic: "admins",
  };

  admin
    .messaging()
    .send(payload)
    .then((response) => {
      console.log("Notification sent successfully:", response);
    })
    .catch((error) => {
      console.error("Error sending notification:", error);
    });

  res.json({
    message: "Notification test successful",
  });
});

router.get("/test/low-stock-notification", (req, res) => {
  const payload = {
    notification: {
      title: "Low Stock Alert 🚨",
      body: "The product is running low on stock.",
    },
    topic: "admins",
  };

  admin
    .messaging()
    .send(payload)
    .then((response) => {
      console.log("Notification sent successfully:", response);
    })
    .catch((error) => {
      console.error("Error sending notification:", error);
    });

  res.json({
    message: "Notification test successful",
  });
});

export default router;
