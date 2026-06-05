import { DataTypes } from "sequelize";
import sequelize from "../config/database.js";

const CommandItemOption = sequelize.define("CommandItemOption", {
  id: { type: DataTypes.BIGINT, primaryKey: true, autoIncrement: true },
  commands_items_id: { type: DataTypes.BIGINT, allowNull: true },
  item_options_id: { type: DataTypes.BIGINT, allowNull: true },
  extra_price: { type: DataTypes.DECIMAL(10, 2), allowNull: true }
}, {
  tableName: "commands_items_options",
  timestamps: false
});

export default CommandItemOption;
