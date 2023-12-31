import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import User from "../models/userModel.js";

export class UserController {
  constructor() {
    console.clear();
  }

  async login(req, res) {
    const { username, pass } = req.body;
    try {
      const user = await User.findAll({
        where: {
          username,
        },
      });
      console.log(user);

      const confPass = await bcrypt.compare(pass, user[0].pass);
      if (!confPass) return res.status(400).json({ msg: "Password salah" });
      const userId = user[0].id;
      const level = user[0].level;

      const accsessToken = jwt.sign(
        { userId, username, level },
        process.env.ACCSESS_TOKEN_SECRET,
        { expiresIn: "20s" }
      );
      const refreshToken = jwt.sign(
        { userId, username, level },
        process.env.REFRESH_TOKEN_SECRET,
        { expiresIn: "5m" }
      );

      res.cookie("token", refreshToken, {
        httpOnly: true,
        maxAge: 10 * 60 * 1000,
      });

      return res.status(200).json({ accsessToken });
    } catch (err) {
      console.log(err);
      return res.status(400).json({ msg: "Username tidak ditemukan" });
    }
  }

  async register(req, res) {
    const { username, pass, name } = req.body;
    const id = "User" + "-" + new Date().getTime().toString();
    const level = "User";
    dotenv.config();
    try {
      const user = await User.findAll({
        where: {
          username,
        },
      });

      // Cek Username apakah sudah tersedia di database
      if (user[0] != undefined)
        return res
          .status(400)
          .json({ msg: "Username talah tersedia di database" });

      // Proses hash password
      const salt = await bcrypt.genSalt();
      const bcryptOfPass = await bcrypt.hash(pass, salt);

      // Proses register User
      await User.create({ id, username, pass: bcryptOfPass, name, level });

      return res.status(200).json({ msg: "berhasil" });
    } catch (err) {
      console.log(err);
      return res.status(400).json({ msg: "gagal/galat" });
    }
  }

  async logout(req, res) {
    try {
      res.clearCookie("token");
      res.status(200).json({ msg: "berhasil keluar" });
    } catch (error) {
      res.sendStatus(400);
    }
  }
}

export const userController = new UserController();
