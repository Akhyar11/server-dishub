import { Sequelize } from "sequelize";
import db from "../utils/connection.js";

const { DataTypes } = Sequelize;

const GambarRambu = db.define(
  "gambar_rambu",
  {
    id_gambarRambu: {
      primaryKey: true,
      type: DataTypes.STRING,
    },
    id_rambu: {
      type: DataTypes.STRING,
    },
    gambar: {
      type: DataTypes.STRING,
    },
    status: {
      type: DataTypes.ENUM,
      values: ["direncanakan", "terpasang", "dipelihara"],
    },
  },
  {
    freezeTableName: true,
  }
);

export default GambarRambu;
