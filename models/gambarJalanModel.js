import { Sequelize } from "sequelize";
import db from "../utils/connection.js";

const { DataTypes } = Sequelize;

const GambarJalan = db.define(
  "gambar_jalan",
  {
    id_gambarJalan: {
      primaryKey: true,
      type: DataTypes.STRING,
    },
    id_jalan: {
      type: DataTypes.STRING,
    },
    gambar: {
      type: DataTypes.STRING,
    },
  },
  {
    freezeTableName: true,
  }
);

export default GambarJalan;
