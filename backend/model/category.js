import { DataTypes, Sequelize } from "sequelize";
import sequelize from "../config/db.js";

const Category = sequelize.define("Category", {
  id: {
    type: Sequelize.INTEGER,
    autoIncrement: true,
    allowNull: false,
    primaryKey: true,
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false,
  },
});

sequelize
  .sync()
  .then(() => {
    console.log("Category table created successfully!");
  })
  .catch((error) => {
    console.error("Unable to create category table : ", error);
  });

export default Category;
