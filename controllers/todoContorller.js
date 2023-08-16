import { Op } from "sequelize";
import Rambu from "../models/rambuModel.js";
import Kecamatan from "../models/kecamatanModel.js";
import Jalan from "../models/jalanModel.js";

class TodoController {
  async getAll(req, res) {
    try {
      const rambu = await Rambu.findAll();
      const ruasJalan = await Jalan.findAll();

      const data = { rambu, ruasJalan };

      return res.status(200).json({ data });
    } catch (err) {
      console.log(err);
      return res.status(400).json({ msg: "gagal mengambil data rambu" });
    }
  }

  async getRambuByPencarian(req, res) {
    const pencarian = req.params.pencarian;
    try {
      const rambu = await Rambu.findAll({
        where: {
          pencarian: {
            [Op.like]: `%${pencarian}%`,
          },
        },
      });

      res.status(200).json({ rambu });
    } catch (err) {
      console.log(err);
      res.status(400).json({ msg: "gagal mencari rambu" });
    }
  }

  async createTodo(req, res) {
    const { id_jalan, jenis_rambu, posisi } = req.body;
    const id_rambu = jenis_rambu + "-" + new Date().getTime().toString();
    try {
      const ruasJalan = await Jalan.findAll({
        where: {
          id_jalan,
        },
      });
      const rambu = await Rambu.findAll({
        where: {
          id_jalan,
          jenis_rambu,
        },
      });
      if (ruasJalan.length > 0) {
        if (rambu.length <= 0) {
          const pencarian = id_rambu + jenis_rambu + posisi;
          await Rambu.create({
            id_rambu,
            id_jalan: ruasJalan[0].id_jalan,
            jenis_rambu,
            posisi,
            pencarian,
          });
          return res.status(200).json({ msg: "berhasil membuat data rambu" });
        } else {
          return res.status(400).json({
            msg: "gagal membuat data rambu, data rambu telah tersedia",
          });
        }
      }
    } catch (err) {
      console.log(err);
      return res.status(400).json({ msg: "gagal membuat data rambu" });
    }
  }

  async updateRambu(req, res) {
    const { jenis_rambu, gambar, posisi } = req.body;
    const id_rambu = req.params.id;
    try {
      const rambu = await Rambu.findAll({
        where: {
          id_rambu,
        },
      });
      if (rambu.length == 0)
        return res.status(200).json({ msg: "tidak ada rambu" });

      const pencarian = id_rambu + jenis_rambu + posisi;

      await rambu.update(
        { jenis_rambu, gambar, posisi, pencarian },
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
