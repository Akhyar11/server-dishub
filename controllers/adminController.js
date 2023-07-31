import Admin from "../models/adminModel.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken"

class AdminController{
    constructor(){
        console.clear();
    }

    async login(req, res){
        console.log(this)
        const {username, pass} = req.body;
        try {
            const user = await Admin.findAll({
                where: {
                    username
                }
            });

            const confPass = await bcrypt.compare(pass, user[0].pass);
            if(!confPass) return res.status(400).json({msg: "Password salah"});
            const userId = user[0].id;

            const accsessToken = jwt.sign({userId, username}, process.env.ACCSESS_TOKEN_SECRET, {expiresIn: "20s"});
            const refreshToken = jwt.sign({userId, username}, process.env.REFRESH_TOKEN_SECRET, {expiresIn: "5m"});

            res.cookie("token", refreshToken, {
                httpOnly: true,
                maxAge: 5 * 60 * 1000
            });

            return res.status(200).json({accsessToken})
        } catch (err) {
            console.log(err)
            return res.status(400).json({msg: "Username tidak ditemukan"})
        }
    }

    async register(req, res){
        const { username, pass, name} = req.body;
        const id = username + "-" + new Date().getTime().toString();
        const level = "Admin";
        try {
            const user = await Admin.findAll({
                where: {
                    username
                }
            });
            
            // Cek Username apakah sudah tersedia di database
            if(user[0] != undefined) return res.status(400).json({msg: "Username talah tersedia di database"});
            
            // Proses hash password
            const salt = await bcrypt.genSalt();
            const bcryptOfPass = await bcrypt.hash(pass, salt);
            
            // Proses register User
            await Admin.create({id, username, pass: bcryptOfPass, name, level});

            return res.status(200).json({msg: "berhasil"});
        } catch (err) {
            console.log(err)
            return res.status(400).json({msg: "gagal/galat"});
        }
    }

    async logout(req, res){
        try {
            res.clearCookie("token");
            res.status(200).json({msg: "berhasil keluar"})
        } catch (error) {
            res.sendStatus(400)
        }

    }
}

export const adminController = new AdminController();