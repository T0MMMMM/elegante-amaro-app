import { DataTypes } from "sequelize";
import sequelize from "../config/database.js";

const Command = sequelize.define("Command", {
  id: { type: DataTypes.BIGINT, primaryKey: true, autoIncrement: true },
  code: { type: DataTypes.STRING(12), allowNull: true },
  user_id: { type: DataTypes.BIGINT, allowNull: true },
  type_id: { type: DataTypes.BIGINT, allowNull: true },
  state_command_id: { type: DataTypes.BIGINT, allowNull: true },
  total_price: { type: DataTypes.DECIMAL(10, 2), allowNull: true },
  tva_rate: { type: DataTypes.DECIMAL(5, 2), allowNull: true },
  table_id: { type: DataTypes.BIGINT, allowNull: true },
  deleted_at: { type: DataTypes.DATE, allowNull: true, defaultValue: null }
}, {
  tableName: "commands",
  timestamps: true,
  createdAt: "created_at",
  updatedAt: "updated_at"
});

export default Command;
