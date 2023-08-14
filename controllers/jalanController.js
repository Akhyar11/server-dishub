import GambarJalan from "../models/gambarJalanModel.js";
import Jalan from "../models/jalanModel.js";
import Rambu from "../models/rambuModel.js";
import { Op } from "sequelize";

class JalanController {
  async addJalan(req, res) {
    const { kecamatan, titik_pangkal, titik_ujung } = req.body;
    const id_jalan =
      titik_pangkal + "-" + titik_ujung + "-" + new Date().getTime().toString();
    try {
      const jalan = await Jalan.findAll({
        where: {
          kecamatan,
          titik_pangkal,
          titik_ujung,
        },
      });
      if (jalan.length !== 0)
        return res.status(400).json({ msg: "jalan sudah tersedia" });
      await Jalan.create({ id_jalan, kecamatan, titik_pangkal, titik_ujung });
      return res.status(200).json({ msg: "data jalan telah dibuat" });
    } catch (err) {
      res.status(400).json({ msg: "data jalan gagal dibuat" });
    }
  }

  async getJalanById(req, res) {
    const id_jalan = req.params.id;
    try {
      const ruasJalan = await Jalan.findAll({
        where: {
          id_jalan: {
            [Op.like]: `%${id_jalan}%`,
          },
        },
      });
      const data = { ruasJalan };
      res.status(200).json({ data });
    } catch (err) {
      console.log(err);
      res.status(400).json({ msg: "gagal mengambil data jalan" });
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
      res.status(200).json({ data });
    } catch (err) {
      console.log(err);
      res.status(400).json({ msg: "gagal mengambil data jalan" });
    }
  }

  async updateJalan(req, res) {
    const { kecamatan, titik_pangkal, titik_ujung } = req.body;
    const id_jalan = req.params.id;
    try {
      const jalan = await Jalan.findAll({
        where: {
          id_jalan,
        },
      });
      if (jalan.length == 0)
        return res.status(200).json({ msg: "tidak ada jalan" });
      await Jalan.update(
        { id_jalan, kecamatan, titik_pangkal, titik_ujung },
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

      return res.status(200).json({ msg: "berhasil menghapus jalan" });
    } catch (err) {
      console.log(err);
      return res.status(400).json({ msg: "gagal menghapus jalan" });
    }
  }

  async getPicture(req, res) {
    const { id_jalan } = req.params.id;
    try {
      const gambar = await GambarJalan.findAll({ where: { id_jalan } });
      res.status(200).json({ gambar });
    } catch (err) {
      res.status(400).json({ msg: "gagal mengambil data gambar" });
    }
  }

  async addPicture(req, res) {
    const path = req.file.destination + req.file.originalname;
    const id_gambarJalan = "gambar" + new Date().getTime().toString();
    try {
      const gambar = process.env.HOST + process.env.PORT + "/" + path;
      await GambarJalan.create({ id_gambarJalan, id_jalan, gambar });

      return res.status(200).json({ msg: "berhasil upload gambar" });
    } catch (err) {
      console.log(err);
      return res.status(400).json({ msg: "gagal upload gambar" });
    }
  }

  async delatePicture(req, res) {
    const id_gambarJalan = req.params.id;
    try {
      const gambar = await GambarJalan.findAll({
        where: {
          id_gambarJalan,
        },
      });
      const path = gambar[0].gambar.split(
        process.env.HOST + process.env.PORT + "/"
      );

      if (path.length == 0)
        return res.status(200).json({ msg: "berhasil hapus gambar" });

      await GambarJalan.destroy({ where: { id_gambarJalan } });

      fs.unlinkSync(path[1]);

      return res.status(200).json({ msg: "berhasil hapus gambar" });
    } catch (err) {
      console.log(err);
      return res.status(400).json({ msg: "gagal hapus gambar" });
    }
  }
}

export const jalanController = new JalanController();
