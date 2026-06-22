import { DataTypes } from "sequelize";
import sequelize from "../config/database.js";

const User = sequelize.define("User", {
  id: {
    type: DataTypes.BIGINT,
    primaryKey: true,
    autoIncrement: true
  },
  name: {
    type: DataTypes.STRING(200),
    allowNull: true
  },
  email: {
    type: DataTypes.STRING(200),
    allowNull: true,
    unique: true
  },
  password_hash: {
    type: DataTypes.STRING(200),
    allowNull: true
  },
  fidelity_points: {
    type: DataTypes.INTEGER,
    allowNull: true,
    defaultValue: 0
  },
  roles: {
    type: DataTypes.JSON,
    allowNull: true,
    get() {
      const raw = this.getDataValue("roles");
      return typeof raw === "string" ? JSON.parse(raw) : raw;
    }
  }
}, {
  tableName: "users",
  timestamps: false
});

export default User;