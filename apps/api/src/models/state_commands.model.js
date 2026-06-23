import { DataTypes } from "sequelize";
import sequelize from "../config/database.js";

const StateCommand = sequelize.define("StateCommand", {
  id: { type: DataTypes.BIGINT, primaryKey: true, autoIncrement: true },
  state: { type: DataTypes.STRING(55), allowNull: false, unique: true },
  deleted_at: { type: DataTypes.DATE, allowNull: true, defaultValue: null }
}, {
  tableName: "state_commands",
  timestamps: false
});

export default StateCommand;
