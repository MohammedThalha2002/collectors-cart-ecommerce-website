import { DataTypes, Sequelize } from "sequelize";
import sequelize from "../config/db.js";
import Category from "./category.js";
import SubCategory from "./subCategory.js";

const Product = sequelize.define("Product", {
  id: {
    type: Sequelize.INTEGER,
    autoIncrement: true,
    allowNull: false,
    primaryKey: true,
  },
  productId: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: {
      msg: "Product ID must be unique. This Product ID already exists.",
    },
    validate: {
      notEmpty: {
        msg: "Product ID cannot be empty",
      },
      isAlphanumeric: {
        msg: "Product ID can only contain letters and numbers",
      },
    },
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  description: {
    type: DataTypes.TEXT,
    allowNull: false,
  },
  images: {
    type: DataTypes.STRING,
    allowNull: false,
    get() {
      const raw = this.getDataValue("images");
      return raw ? raw.split(";") : [];
    },
    set(val) {
      this.setDataValue("images", Array.isArray(val) ? val.join(";") : "");
    },
  },
  costPrice: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  sellingPrice: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  continent: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  country: {
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
  subCategoryId: {
    type: Sequelize.INTEGER,
    allowNull: true,
    references: {
      model: SubCategory,
      key: "id",
    },
  },
  bestSeller: {
    type: DataTypes.BOOLEAN,
    defaultValue: false,
  },
  isDealOfTheDay: {
    type: DataTypes.BOOLEAN,
    defaultValue: false,
  },
  gst: {
    type: DataTypes.FLOAT,
    allowNull: false,
    defaultValue: 5,
  },
  tags: {
    type: DataTypes.STRING,
    defaultValue: "",
    get() {
      return this.getDataValue("tags").split(";");
    },
    set(val) {
      this.setDataValue("tags", val.join(";"));
    },
  },
  inStock: {
    type: DataTypes.INTEGER,
    defaultValue: 1,
  },
  shippingPeriod: {
    type: DataTypes.INTEGER,
    defaultValue: 7,
  },
  notifyUserIds: {
    type: DataTypes.STRING,
    defaultValue: null,
    get() {
      const raw = this.getDataValue("notifyUserIds");
      return raw ? raw.split(";") : [];
    },
    set(val) {
      this.setDataValue(
        "notifyUserIds",
        Array.isArray(val) ? val.join(";") : ""
      );
    },
  },
});

// A Category can have many SubCategories
Category.hasMany(SubCategory, { foreignKey: "categoryId" });
SubCategory.belongsTo(Category, { foreignKey: "categoryId" });

// A SubCategory can have many Products
SubCategory.hasMany(Product, { foreignKey: "subCategoryId" });
Product.belongsTo(SubCategory, { foreignKey: "subCategoryId" });

// A Category can have many Products
Category.hasMany(Product, { foreignKey: "categoryId" });
Product.belongsTo(Category, { foreignKey: "categoryId" });

sequelize
  // .sync({ alter: true })
  .sync()
  .then(() => {
    console.log("Product table created successfully!");
  })
  .catch((error) => {
    console.error("Unable to create table : ", error);
  });

export default Product;
