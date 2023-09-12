import GambarJalan from "../models/gambarJalanModel.js";
import Jalan from "../models/jalanModel.js";
import Rambu from "../models/rambuModel.js";
import { Op } from "sequelize";

class JalanController {
  async addJalan(req, res) {
    const { kecamatan, jalan, titik_pangkal, titik_ujung } = req.body;
    const id_jalan =
      titik_pangkal + "-" + titik_ujung + "-" + new Date().getTime().toString();
    const pencarian =
      kecamatan + titik_pangkal + titik_ujung + id_jalan + jalan;
    try {
      const response = await Jalan.findAll({
        where: {
          kecamatan,
          jalan,
          titik_pangkal,
          titik_ujung,
        },
      });
      if (response.length !== 0)
        return res.status(400).json({ msg: "jalan sudah tersedia" });
      await Jalan.create({
        id_jalan,
        kecamatan,
        jalan,
        titik_pangkal,
        titik_ujung,
        pencarian,
      });
      return res.status(200).json({ msg: "data jalan telah dibuat" });
    } catch (err) {
      console.log({ err });
      res.status(400).json({ msg: "data jalan gagal dibuat" });
    }
  }

  async getJalanById(req, res) {
    const pencarianParams = req.params.id;
    try {
      const ruasJalan = await Jalan.findAll({
        where: {
          pencarian: {
            [Op.like]: `%${pencarianParams}%`,
          },
        },
      });
      const data = { ruasJalan };
      return res.status(200).json({ data });
    } catch (err) {
      console.log(err);
      return res.status(400).json({ msg: "gagal mengambil data jalan" });
    }
  }

  async getJalanWithRambuById(req, res) {
    Jalan.hasOne(Rambu, { foreignKey: "id_jalan" });
    Jalan.belongsTo(Rambu, { foreignKey: "id_jalan" });
    const id_jalan = req.params.id;
    try {
      const ruasJalan = await Jalan.findAll({
        where: {
          id_jalan,
        },
      });
      const rambu = await Rambu.findAll({
        where: {
          id_jalan,
        },
      });
      const data = { ruasJalan, rambu };
      return res.status(200).json({ data });
    } catch (err) {
      console.log(err);
      return res.status(400).json({ msg: "gagal mengambil data jalan" });
    }
  }

  async updateJalan(req, res) {
    const { kecamatan, jalan, titik_pangkal, titik_ujung } = req.body;
    const id_jalan = req.params.id;
    try {
      const response = await Jalan.findAll({
        where: {
          id_jalan,
        },
      });
      if (response.length == 0)
        return res.status(200).json({ msg: "tidak ada jalan" });
      await Jalan.update(
        { id_jalan, jalan, kecamatan, titik_pangkal, titik_ujung },
        {
          where: {
            id_jalan,
          },
        }
      );

      return res.status(200).json({ msg: "Jalan sudah diupdate" });
    } catch (err) {
      return res.status(200).josn({ msg: "gagal" });
    }
  }

  async deleteJalan(req, res) {
    const id_jalan = req.params.id;
    try {
      await Jalan.destroy({
        where: {
          id_jalan,
        },
      });

      await Rambu.destroy({
        where: {
          id_jalan,
        },
      });

      return res.status(200).json({ msg: "berhasil menghapus jalan" });
    } catch (err) {
      console.log(err);
      return res.status(400).json({ msg: "gagal menghapus jalan" });
    }
  }
}

export const jalanController = new JalanController();
