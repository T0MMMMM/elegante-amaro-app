import { DataTypes } from "sequelize";
import sequelize from "../config/database.js";

const ItemItemOption = sequelize.define("ItemItemOption", {
  id: { type: DataTypes.BIGINT, primaryKey: true, autoIncrement: true },
  item_id: { type: DataTypes.BIGINT, allowNull: true },
  item_option_id: { type: DataTypes.BIGINT, allowNull: true }
}, {
  tableName: "items_item_options",
  timestamps: false
});

export default ItemItemOption;
