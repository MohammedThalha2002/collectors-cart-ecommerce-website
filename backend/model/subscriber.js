import { DataTypes } from "sequelize";
import sequelize from "../config/db.js";

const Subscriber = sequelize.define(
  "Subscriber",
  {
    email: {
      type: DataTypes.STRING,
      unique: true,
      allowNull: false,
      validate: {
        isEmail: true,
      },
    },
  },
  {
    timestamps: true,
    tableName: "subscribers",
  }
);

sequelize
  .sync()
  .then(() => {
    console.log("Subscribers table created successfully!");
  })
  .catch((error) => {
    console.error("Unable to create category table : ", error);
  });

export default Subscriber;
