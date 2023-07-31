import { Sequelize } from "sequelize";
import db from "../utils/connection.js";

const { DataTypes } = Sequelize;

const Admin = db.define("admin", {
  id: {
    primaryKey: true,
    type: DataTypes.STRING
  },
  pass: {
    type: DataTypes.STRING
  },
  level: {
    type: DataTypes.STRING,
    values: "Admin"
  },
  name: {
    type: DataTypes.STRING
  },
  username: {
    type: DataTypes.STRING
  },
  photo_profil: {
    type: DataTypes.STRING
  }
}, {
  freezeTableName: true
})

export default Admin