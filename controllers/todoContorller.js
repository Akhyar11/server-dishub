import fs from "fs";
import { Op } from "sequelize";
import Rambu from "../models/rambuModel.js";
import Kecamatan from "../models/kecamatanModel.js";
import Jalan from "../models/jalanModel.js";

class TodoController {
  async getAll(req, res) {
    Kecamatan.hasOne(Rambu, { foreignKey: "kecamatan" });
    Kecamatan.belongsTo(Rambu, { foreignKey: "kecamatan" });
    try {
      const kec = await Kecamatan.findAll();
      const rambu = await Rambu.findAll();
      const ruasJalan = await Jalan.findAll();

      const data = { kec, rambu, ruasJalan };

      return res.status(200).json({ data });
    } catch (err) {
      console.log(err);
      return res.status(400).json({ msg: "gagal mengambil data rambu" });
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

  async createTodo(req, res) {
    const {
      kecamatan,
      jenis_rambu,
      gambar,
      kanan,
      kiri,
      tengah,
      titik_pangkal,
      titik_ujung,
    } = req.body;
    const id_kecamatan = kecamatan + "-" + new Date().getTime().toString();
    const id_rambu = jenis_rambu + "-" + new Date().getTime().toString();
    const jalan = `${titik_pangkal}-${titik_ujung}`;
    const id_jalan = jalan + "-" + new Date().getTime().toString();
    try {
      const kec = await Kecamatan.findAll({
        where: {
          kecamatan,
        },
      });
      const ruasJalan = await Jalan.findAll({
        where: {
          kecamatan,
          titik_pangkal,
          titik_ujung,
        },
      });
      const rambu = await Rambu.findAll({
        where: {
          kecamatan,
          jenis_rambu,
          jalan,
        },
      });

      if (kec.length <= 0) {
        await Kecamatan.create({
          id_kecamatan,
          kecamatan,
        });
      }
      if (ruasJalan.length <= 0) {
        await Jalan.create({
          id_jalan,
          kecamatan,
          titik_pangkal,
          titik_ujung,
        });
      }
      if (rambu.length <= 0) {
        await Rambu.create({
          id_rambu,
          kecamatan,
          jalan,
          jenis_rambu,
          gambar,
          kanan,
          kiri,
          tengah,
        });
      } else {
        return res
          .status(400)
          .json({ msg: "gagal membuat data rambu, data rambu telah tersedia" });
      }

      return res.status(200).json({ msg: "berhasil membuat data rambu" });
    } catch (err) {
      console.log(err);
      return res.status(400).json({ msg: "gagal membuat data rambu" });
    }
  }

  async addPicture(req, res) {
    const id_rambu = req.params.id;
    const path = req.file.destination + req.file.originalname;
    try {
      const gambar = process.env.HOST + process.env.PORT + "/" + path;
      await Rambu.update(
        { gambar },
        {
          where: {
            id_rambu,
          },
        }
      );

      return res.status(200).json({ msg: "berhasil upload gambar" });
    } catch (err) {
      console.log(err);
      return res.status(400).json({ msg: "gagal upload gambar" });
    }
  }

  async delatePicture(req, res) {
    const id_rambu = req.params.id;
    try {
      const rambu = await Rambu.findAll({
        where: {
          id_rambu,
        },
      });
      const path = rambu[0].gambar.split(
        process.env.HOST + process.env.PORT + "/"
      );

      if (path.length == 0)
        return res.status(200).json({ msg: "berhasil hapus gambar" });

      await Rambu.update(
        { gambar: "" },
        {
          where: {
            id_rambu,
          },
        }
      );

      fs.unlinkSync(path[1]);

      return res.status(200).json({ msg: "berhasil hapus gambar" });
    } catch (err) {
      console.log(err);
      return res.status(400).json({ msg: "gagal hapus gambar" });
    }
  }

  async updatePicture(req, res) {
    const id_rambu = req.params.id;
    try {
      const rambu = await Rambu.findAll({
        where: {
          id_rambu,
        },
      });
      const path = rambu[0].gambar.split(
        process.env.HOST + process.env.PORT + "/"
      );

      if (path.length == 0)
        return res.status(200).json({ msg: "data gambar tidak tersedia" });

      fs.unlinkSync(path[1]);

      const gambar =
        process.env.HOST +
        process.env.PORT +
        "/" +
        req.file.destination +
        req.file.originalname;
      await Rambu.update(
        { gambar },
        {
          where: {
            id_rambu,
          },
        }
      );

      return res.status(200).json({ msg: "berhasil update gambar" });
    } catch (err) {
      console.log(err);
      return res.status(400).json({ msg: "gagal update gambar" });
    }
  }

  async updateKecamatan(req, res) {
    const { kecamatan, titik_pangkal, titik_ujung } = req.body;
    const id_kecamatan = req.params.id;
    try {
      const kec = await Kecamatan.findAll({
        where: {
          id_kecamatan,
        },
      });
      if (kec.length == 0)
        return res.status(200).json({ msg: "tidak ada kecamatan" });
      await Kecamatan.update(
        { id_kecamatan, kecamatan, titik_pangkal, titik_ujung },
        {
          where: {
            id_kecamatan,
          },
        }
      );

      return res.status(200).json({ msg: "kecamatan sudah diupdate" });
    } catch (err) {
      return res.status(200).josn({ msg: "gagal" });
    }
  }

  async updateRambu(req, res) {
    const { kecamatan, jalan, jenis_rambu, gambar, kanan, kiri, tengah } =
      req.body;
    const id_rambu = req.params.id;
    try {
      const rambu = await Rambu.findAll({
        where: {
          id_rambu,
        },
      });
      if (rambu.length == 0)
        return res.status(200).json({ msg: "tidak ada rambu" });
      await rambu.update(
        { kecamatan, jalan, jenis_rambu, gambar, kanan, kiri, tengah },
        {
          where: {
            id_rambu,
          },
        }
      );

      return res.status(200).json({ msg: "kecamatan sudah diupdate" });
    } catch (err) {
      return res.status(200).josn({ msg: "gagal" });
    }
  }

  async deleteKecamatan(req, res) {
    const id_kecamatan = req.params.id;
    try {
      await Kecamatan.destroy({
        where: {
          id_kecamatan,
        },
      });

      return res.status(200).json({ msg: "berhasil menghapus kecamatan" });
    } catch (err) {
      console.log(err);
      return res.status(400).json({ msg: "gagal menghapus kecamatan" });
    }
  }

  async deleteRambu(req, res) {
    const id_rambu = req.params.id;
    try {
      await Rambu.destroy({
        where: {
          id_rambu,
        },
      });

      return res.status(200).json({ msg: "berhasil menghapus rambu" });
    } catch (err) {
      console.log(err);
      return res.status(400).json({ msg: "gagal menghapus rambu" });
    }
  }
}

export const todoContorller = new TodoController();
