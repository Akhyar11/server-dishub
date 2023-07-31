import Rambu from "../models/rambuModel.js";
import Kecamatan from "../models/kecamatanModel.js";

class TodoController{
    async getAll(req, res){
        Kecamatan.hasOne(Rambu, { foreignKey: "kecamatan" });
        Kecamatan.belongsTo(Rambu, { foreignKey: "kecamatan" });
        try {
            const todos = await Kecamatan.findAll({
                include: [
                    { model: Rambu }
                ]
            })

            if(todos.length == 0) return res.status(400).json({msg: "data rambu tidak ada atau belum dibuat"});
            return res.status(200).json({todos})
        } catch (err) {
            return res.status(400).json({msg: "gagal mengambil data rambu"});
        }
    }

    async createTodo(req, res){
        const { kecamatan, jalan, jenis_rambu, gambar, kanan, kiri, tengah, titik_pangkal, titik_ujung } = req.body;
        const id_kecamatan = kecamatan+"-"+new Date().getTime().toString();
        const id_rambu = jenis_rambu+"-"+new Date().getTime().toString();
        try {
            const kec = await Kecamatan.findAll({
                where: {
                    kecamatan
                }
            })
            
            const rambu = await Rambu.findAll({
                where: {
                    kecamatan, jenis_rambu
                }
            })
            
            if(kec.length <= 0){
                console.log(id_rambu)
                await Kecamatan.create({ id_kecamatan, kecamatan, titik_pangkal, titik_ujung });
            } 
            if(rambu.length <= 0){
                await Rambu.create({ id_rambu, kecamatan, jalan, jenis_rambu, gambar, kanan, kiri, tengah });
            } else {
                return res.status(400).json({msg: "gagal membuat data rambu, data rambu telah tersedia"})
            }

            return res.status(200).json({msg: "berhasil membuat data rambu"});
        } catch (err) {
            console.log(err)
            return res.status(400).json({msg: "gagal membuat data rambu"})
        }
    }
}

export const todoContorller = new TodoController();