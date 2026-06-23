import { DataTypes } from "sequelize";
import sequelize from "../config/database.js";

const StateCommand = sequelize.define("StateCommand", {
  id: { type: DataTypes.BIGINT, primaryKey: true, autoIncrement: true },
  state: { type: DataTypes.STRING(55), allowNull: false, unique: true },
  deleted_at: { type: DataTypes.DATE, allowNull: true, defaultValue: null },
  position: { type: DataTypes.INTEGER, allowNull: true, defaultValue: null },
  color: { type: DataTypes.STRING(20), allowNull: true, defaultValue: null },
  quick_action_enabled: { type: DataTypes.BOOLEAN, allowNull: false, defaultValue: false },
  icon: { type: DataTypes.STRING(20), allowNull: true, defaultValue: null },
  hidden_in_board: { type: DataTypes.BOOLEAN, allowNull: false, defaultValue: false },
  visible_on_mobile: { type: DataTypes.BOOLEAN, allowNull: false, defaultValue: true },
  is_final: { type: DataTypes.BOOLEAN, allowNull: false, defaultValue: false }
}, {
  tableName: "state_commands",
  timestamps: false
});

export default StateCommand;
