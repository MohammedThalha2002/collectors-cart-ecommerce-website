import { DataTypes, Sequelize } from "sequelize";
import sequelize from "../config/db.js";
import User from "./user.js";

const Order = sequelize.define("Order", {
  id: {
    type: Sequelize.INTEGER,
    autoIncrement: true,
    allowNull: false,
    primaryKey: true,
  },
  orderId: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  paymentId: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  paymentMethod: {
    type: DataTypes.STRING,
    allowNull: false,
    defaultValue: "UPI",
  },
  deliveryStatus: {
    type: DataTypes.STRING,
    allowNull: false,
    defaultValue: "pending",
  },
  discount: {
    type: DataTypes.INTEGER,
    allowNull: false,
    defaultValue: 0,
  },
  total: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  invoiceUrl: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  userId: {
    type: Sequelize.INTEGER,
    allowNull: false,
    references: {
      model: User,
      key: "id",
    },
  },
  deliveryName: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  deliveryPhone: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  deliveryAddress: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  trackingNumber: {
    type: DataTypes.STRING,
    allowNull: true,
  },
});

// A User can have many Orders
User.hasMany(Order, { foreignKey: "userId" });

// An Order belongs to a User
Order.belongsTo(User, { foreignKey: "userId" });

sequelize
  .sync()
  .then(() => {
    console.log("Order table created successfully!");
  })
  .catch((error) => {
    console.error("Unable to create table : ", error);
  });

export default Order;
