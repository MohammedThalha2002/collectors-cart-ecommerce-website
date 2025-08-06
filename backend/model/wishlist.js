import { DataTypes, Sequelize } from "sequelize";
import sequelize from "../config/db.js";
import User from "./user.js";
import Product from "./product.js";

const Wishlist = sequelize.define("Wishlist", {
  id: {
    type: Sequelize.INTEGER,
    autoIncrement: true,
    allowNull: false,
    primaryKey: true,
  },
  userId: {
    type: Sequelize.INTEGER,
    allowNull: false,
    references: {
      model: User,
      key: "id",
    },
  },
  productId: {
    type: Sequelize.INTEGER,
    allowNull: false,
    references: {
      model: Product,
      key: "id",
    },
  },
});

// Define associations
Wishlist.belongsTo(User, { foreignKey: "userId" });
Wishlist.belongsTo(Product, { foreignKey: "productId" });
User.hasMany(Wishlist, { foreignKey: "userId" });
Product.hasMany(Wishlist, { foreignKey: "productId" });

sequelize
  .sync()
  .then(() => {
    console.log("Wishlist table created successfully!");
  })
  .catch((error) => {
    console.error("Unable to create table : ", error);
  });

export default Wishlist;
