import { Sequelize } from "sequelize";
import db from "../utils/connection.js";
import Rambu from "./rambuModel.js";

const { DataTypes } = Sequelize;

const Kecamatan = db.define(
  "kecamatan",
  {
    id_kecamatan: {
      primaryKey: true,
      type: DataTypes.STRING,
    },
    kecamatan: {
      type: DataTypes.STRING,
    },
  },
  {
    freezeTableName: true,
  }
);

export default Kecamatan;
