import { DataTypes, Sequelize } from "sequelize";
import sequelize from "../config/db.js";
import Category from "./category.js";

const SubCategory = sequelize.define("SubCategory", {
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
  image: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  categoryId: {
    type: Sequelize.INTEGER,
    allowNull: false,
    references: {
      model: Category,
      key: "id",
    },
  },
});

sequelize
  .sync()
  .then(() => {
    console.log("SubCategory table created successfully!");
  })
  .catch((error) => {
    console.error("Unable to create table : ", error);
  });

export default SubCategory;
