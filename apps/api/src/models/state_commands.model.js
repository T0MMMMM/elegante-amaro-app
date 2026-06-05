import { DataTypes } from "sequelize";
import sequelize from "../config/database.js";

const StateCommand = sequelize.define("StateCommand", {
  id: { type: DataTypes.BIGINT, primaryKey: true, autoIncrement: true },
  state: { type: DataTypes.STRING(55), allowNull: false, unique: true }
}, {
  tableName: "state_commands",
  timestamps: false
});

export default StateCommand;
