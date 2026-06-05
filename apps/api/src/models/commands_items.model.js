import { DataTypes } from "sequelize";
import sequelize from "../config/database.js";

const CommandItem = sequelize.define("CommandItem", {
  id: { type: DataTypes.BIGINT, primaryKey: true, autoIncrement: true },
  item_id: { type: DataTypes.BIGINT, allowNull: true },
  command_id: { type: DataTypes.BIGINT, allowNull: true },
  quantity: { type: DataTypes.INTEGER, allowNull: true },
  unit_price: { type: DataTypes.DECIMAL(10, 2), allowNull: true },
  line_total: { type: DataTypes.DECIMAL(10, 2), allowNull: true },
  size: { type: DataTypes.ENUM("petit", "moyen", "grand"), allowNull: true }
}, {
  tableName: "commands_items",
  timestamps: false
});

export default CommandItem;
