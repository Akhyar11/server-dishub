import { Sequelize } from "sequelize";
import db from "../utils/connection.js";

const { DataTypes } = Sequelize;

const Rambu = db.define("Rambu", {
    id_rambu: {
        primaryKey: true,
        type: DataTypes.STRING
    },
    kecamatan: {
        type: DataTypes.STRING
    },
    jalan: {
        type: DataTypes.STRING
    },
    jenis_rambu: {
        type: DataTypes.STRING
    },
    gambar: {
        type: DataTypes.STRING
    },
    kanan: {
        type: DataTypes.BOOLEAN
    },
    kiri: {
        type: DataTypes.BOOLEAN
    },
    tengah: {
        type: DataTypes.BOOLEAN
    }
}, {
    freezeTableName: true
});

export default Rambu;