import { DataTypes } from "sequelize";
import sequelize from "../config/database.js";

const CommandType = sequelize.define("CommandType", {
  id: { type: DataTypes.BIGINT, primaryKey: true, autoIncrement: true },
  name: { type: DataTypes.STRING(55), allowNull: false, unique: true }
}, {
  tableName: "commands_types",
  timestamps: false
});

export default CommandType;
