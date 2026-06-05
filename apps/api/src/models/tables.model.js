import { DataTypes } from "sequelize";
import sequelize from "../config/database.js";

const Table = sequelize.define("Table", {
  id: { type: DataTypes.BIGINT, primaryKey: true, autoIncrement: true },
  numero: { type: DataTypes.INTEGER, allowNull: false, unique: true }
}, {
  tableName: "tables",
  timestamps: false
});

export default Table;
