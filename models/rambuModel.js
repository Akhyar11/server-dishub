import { Sequelize } from "sequelize";
import db from "../utils/connection.js";

const { DataTypes } = Sequelize;

const Rambu = db.define(
  "Rambu",
  {
    id_rambu: {
      primaryKey: true,
      type: DataTypes.STRING,
    },
    id_jalan: {
      type: DataTypes.STRING,
    },
    jenis_rambu: {
      type: DataTypes.STRING,
    },
    gambar: {
      type: DataTypes.STRING,
    },
    posisi: {
      type: DataTypes.ENUM,
      values: ["kanan", "kiri", "tengah"],
    },
    pencarian: {
      type: DataTypes.STRING,
    },
  },
  {
    freezeTableName: true,
  }
);

export default Rambu;
