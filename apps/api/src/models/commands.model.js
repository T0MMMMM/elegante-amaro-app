import { DataTypes } from "sequelize";
import sequelize from "../config/database.js";

const Command = sequelize.define("Command", {
  id: { type: DataTypes.BIGINT, primaryKey: true, autoIncrement: true },
  user_id: { type: DataTypes.BIGINT, allowNull: true },
  type_id: { type: DataTypes.BIGINT, allowNull: true },
  state_command_id: { type: DataTypes.BIGINT, allowNull: true },
  total_price: { type: DataTypes.DECIMAL(10, 2), allowNull: true },
  tva_rate: { type: DataTypes.DECIMAL(5, 2), allowNull: true },
  table_id: { type: DataTypes.BIGINT, allowNull: true }
}, {
  tableName: "commands",
  timestamps: true
});

export default Command;
