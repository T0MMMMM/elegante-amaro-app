import { DataTypes } from "sequelize";
import sequelize from "../config/database.js";

const ItemOption = sequelize.define("ItemOption", {
  id: { type: DataTypes.BIGINT, primaryKey: true, autoIncrement: true },
  name: { type: DataTypes.STRING(55), allowNull: true },
  extra_price: { type: DataTypes.DECIMAL(10, 2), allowNull: true }
}, {
  tableName: "item_options",
  timestamps: false
});

export default ItemOption;
