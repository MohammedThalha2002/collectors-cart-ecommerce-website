import { DataTypes, Sequelize } from "sequelize";
import sequelize from "../config/db.js";

const VideoBanner = sequelize.define(
  "VideoBanner",
  {
    id: {
      type: Sequelize.INTEGER,
      primaryKey: true,
      defaultValue: 1,
    },
    url: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    description: {
      type: DataTypes.STRING,
      allowNull: true,
    },
  },
  {
    timestamps: false,
  }
);

sequelize
  .sync()
  .then(() => {
    console.log("VideoBanner table created successfully!");
  })
  .catch((error) => {
    console.error("Unable to create table : ", error);
  });

export default VideoBanner;
