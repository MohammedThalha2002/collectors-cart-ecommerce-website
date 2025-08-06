import { DataTypes, Sequelize } from "sequelize";
import sequelize from "../config/db.js";

const Admin = sequelize.define(
  "Admin",
  {
    id: {
      type: Sequelize.INTEGER,
      autoIncrement: true,
      allowNull: false,
      primaryKey: true,
    },
    username: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    role: {
      type: DataTypes.ENUM("super-admin", "admin", "moderator"),
      allowNull: false,
    },
  },
  {
    timestamps: false,
  }
);

sequelize
  .sync()
  .then(() => {
    console.log("Admin table created successfully!");
  })
  .catch((error) => {
    console.error("Unable to create table : ", error);
  });

export default Admin;
