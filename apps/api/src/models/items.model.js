import { DataTypes } from "sequelize";
import sequelize from "../config/database.js";

const Item = sequelize.define("Item", {
  id: { type: DataTypes.BIGINT, primaryKey: true, autoIncrement: true },
  name: { type: DataTypes.STRING(55), allowNull: true },
  slug: { type: DataTypes.STRING(150), allowNull: true, unique: true },
  price: { type: DataTypes.DECIMAL(10, 2), allowNull: true },
  image: { type: DataTypes.STRING(255), allowNull: true },
  category_id: { type: DataTypes.BIGINT, allowNull: true }
}, {
  tableName: "items",
  timestamps: true,
  createdAt: "created_at",
  updatedAt: "updated_at"
});

export default Item;
