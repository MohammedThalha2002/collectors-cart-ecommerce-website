import { DataTypes, Sequelize } from "sequelize";
import sequelize from "../config/db.js";

const Announcement = sequelize.define(
  "Announcement",
  {
    id: {
      type: Sequelize.INTEGER,
      primaryKey: true,
      defaultValue: 1,
    },
    content: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    expires_at: {
      type: DataTypes.DATE,
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
    console.log("Announcement table created successfully!");
  })
  .catch((error) => {
    console.error("Unable to create table : ", error);
  });

export default Announcement;
