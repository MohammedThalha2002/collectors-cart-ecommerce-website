import { DataTypes, Sequelize } from "sequelize";
import sequelize from "../config/db.js";
import Order from "./order.js";
import Product from "./product.js";

const OrderItem = sequelize.define(
  "OrderItem",
  {
    id: {
      type: Sequelize.INTEGER,
      autoIncrement: true,
      allowNull: false,
      primaryKey: true,
    },
    orderId: {
      type: Sequelize.INTEGER,
      allowNull: false,
      references: {
        model: Order, // Reference to the Order model
        key: "id",
      },
    },
    productId: {
      type: Sequelize.INTEGER,
      allowNull: false,
      references: {
        model: Product, // Reference to the Product model
        key: "id",
      },
    },
    birthdayDate: {
      type: DataTypes.DATE,
      allowNull: true,
    },
    quantity: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 1,
    },
    price: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
  },
  {
    timestamps: false,
  }
);

// One Order can have many OrderItems
Order.hasMany(OrderItem, { foreignKey: "orderId", onDelete: "CASCADE" });
OrderItem.belongsTo(Order, { foreignKey: "orderId" });

// One Product can appear in many OrderItems
Product.hasMany(OrderItem, { foreignKey: "productId", onDelete: "CASCADE" });
OrderItem.belongsTo(Product, { foreignKey: "productId" });

sequelize
  .sync()
  .then(() => {
    console.log("Order Item table created successfully!");
  })
  .catch((error) => {
    console.error("Unable to create table : ", error);
  });

export default OrderItem;
