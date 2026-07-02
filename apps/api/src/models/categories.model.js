import { DataTypes } from "sequelize";
import sequelize from "../config/database.js";

const Category = sequelize.define("Category", {
  id: { type: DataTypes.BIGINT, primaryKey: true, autoIncrement: true },
  name: { type: DataTypes.STRING(55), allowNull: false, unique: true },
  deleted_at: { type: DataTypes.DATE, allowNull: true, defaultValue: null }
}, {
  tableName: "categories",
  timestamps: false
});

export default Category;
