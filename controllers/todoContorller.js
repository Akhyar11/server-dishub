import { Op } from "sequelize";
import Rambu from "../models/rambuModel.js";
import Jalan from "../models/jalanModel.js";
import GambarRambu from "../models/gambarJalanModel.js";

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

  async getJalanRambu(req, res) {
    const id_jalan = req.params.id;
    try {
      const rambu = await Rambu.findAll({
        where: {
          id_jalan,
        },
      });
      const ruasJalan = await Jalan.findAll({
        where: {
          id_jalan,
        },
      });

      const data = { rambu, ruasJalan };

      return res.status(200).json({ data });
    } catch (err) {
      console.log(err);
      return res.status(400).json({ msg: "gagal mengambil data rambu" });
    }
  }

  async getRambu(req, res) {
    const id_rambu = req.params.id;
    try {
      const rambu = await Rambu.findAll({
        where: {
          id_rambu,
        },
      });

      const status = await GambarRambu.findAll({
        where: {
          id_rambu,
        },
      });

      const ruasJalan = await Jalan.findAll({
        where: {
          id_jalan: rambu[0].id_jalan
        }
      });

      const data = { rambu, status, ruasJalan };

      return res.status(200).json({ data });
    } catch (err) {
      console.log(err);
      return res.status(400).json({ msg: "gagal mengambil data rambu" });
    }
  }

  async getRambuByPencarian(req, res) {
    const pencarian = req.params.id;
    try {
      const rambu = await Rambu.findAll({
        where: {
          pencarian: {
            [Op.like]: `%${pencarian}%`,
          },
        },
      });

      return res.status(200).json({ rambu });
    } catch (err) {
      console.log(err);
      return res.status(400).json({ msg: "gagal mencari rambu" });
    }
  }

  async createTodo(req, res) {
    const { id_jalan, jenis_rambu, posisi, koordinat, status } = req.body;
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
          posisi,
          koordinat
        },
      });
      if (ruasJalan.length > 0) {
        if (rambu.length <= 0) {
          const pencarian =
            id_rambu + jenis_rambu + posisi + koordinat + status;
          await Rambu.create({
            id_rambu,
            id_jalan: ruasJalan[0].id_jalan,
            jenis_rambu,
            koordinat,
            posisi,
            status,
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
    const { jenis_rambu, posisi, koordinat, status } = req.body;
    const id_rambu = req.params.id;
    try {
      const rambu = await Rambu.findAll({
        where: {
          id_rambu,
        },
      });
      if (rambu.length == 0)
        return res.status(200).json({ msg: "tidak ada rambu" });

      const pencarian = id_rambu + jenis_rambu + posisi + koordinat + status;

      await Rambu.update(
        { jenis_rambu, posisi, pencarian, koordinat, status },
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
      await GambarRambu.destroy({
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

  async addGambarStatus(req, res) {
    const id_rambu = req.params.id;
    const path = req.file.destination + req.file.originalname;
    const id_gambarRambu = "gambar" + new Date().getTime().toString();
    try {
      const gambar = process.env.HOST + process.env.PORT + "/" + path;
      await GambarRambu.create({
        id_gambarRambu,
        id_rambu,
        gambar,
        status: "direncanakan",
      });

      return res.status(200).json({ msg: "berhasil upload gambar" });
    } catch (err) {
      console.log(err);
      return res.status(400).json({ msg: "gagal upload gambar" });
    }
  }

  async addStatus(req, res) {
    const status = req.body.status;
    const id_gambarRambu = req.params.id;
    try {
      const gambar = await GambarRambu.findAll({
        where: {
          id_gambarRambu,
        },
      });
      const rambu = await Rambu.findAll({
        where: {
          id_rambu: gambar[0].id_rambu,
        },
      });
      const path = gambar[0].gambar;

      if (path.length == 0)
        return res.status(400).json({ msg: "gambar tidak tersedia" });
      const pencarian =
        rambu[0].id_rambu +
        rambu[0].jenis_rambu +
        rambu[0].posisi +
        rambu[0].koordinat +
        status;
      await GambarRambu.update({ status }, { where: { gambar: path } });
      await Rambu.update(
        { status, pencarian },
        {
          where: {
            id_rambu: gambar[0].id_rambu,
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
    const id_gambarRambu = req.params.id;
    try {
      const gambar = await GambarRambu.findAll({
        where: {
          id_gambarRambu,
        },
      });
      const path = gambar[0].gambar.split(
        process.env.HOST + process.env.PORT + "/"
      );

      if (path.length == 0)
        return res.status(200).json({ msg: "berhasil hapus gambar" });

      await GambarRambu.update({ gambar: "" }, { where: { id_gambarRambu } });

      fs.unlinkSync(path[1]);

      return res.status(200).json({ msg: "berhasil hapus gambar" });
    } catch (err) {
      console.log(err);
      return res.status(400).json({ msg: "gagal hapus gambar" });
    }
  }
}

export const todoContorller = new TodoController();
