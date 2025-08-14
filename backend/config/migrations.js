import sequelize from "./db.js";
import { DataTypes } from "sequelize";
import Product from "../model/product.js";

const migrateProductIds = async () => {
  try {
    console.log("Starting Product ID migration...");

    // Get all products without productId
    const products = await Product.findAll({
      where: {
        productId: null,
      },
    });

    console.log(`Found ${products.length} products to update`);

    // Update each product with a unique productId
    for (let i = 0; i < products.length; i++) {
      const product = products[i];
      const uniqueId = `PROD${Date.now()}${i.toString().padStart(3, "0")}`;

      await product.update({
        productId: uniqueId,
      });

      console.log(`Updated product ${product.id} with productId: ${uniqueId}`);
    }

    // Now make the column NOT NULL
    await sequelize.getQueryInterface().changeColumn("Products", "productId", {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    });

    console.log("Migration completed successfully!");
  } catch (error) {
    console.error("Migration failed:", error);
  }
};

export default migrateProductIds;
