import { Sequelize } from "sequelize";
import db from "../utils/connection.js";

const { DataTypes } = Sequelize;

const Jalan = db.define(
  "jalan",
  {
    id_jalan: {
      primaryKey: true,
      type: DataTypes.STRING,
    },
    kecamatan: {
      type: DataTypes.STRING,
    },
    titik_pangkal: {
      type: DataTypes.STRING,
    },
    titik_ujung: {
      type: DataTypes.STRING,
    },
  },
  {
    freezeTableName: true,
  }
);

export default Jalan;
