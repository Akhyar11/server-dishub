import Rambu from "../models/rambuModel.js";
import Kecamatan from "../models/kecamatanModel.js";

class TodoController{
    async getAll(req, res){
        Kecamatan.hasOne(Rambu, { foreignKey: "kecamatan" });
        Kecamatan.belongsTo(Rambu, { foreignKey: "kecamatan" });
        try {
            const kec = await Kecamatan.findAll();
            const rambu = await Rambu.findAll();

            const data = {kec, rambu}

            if(todos.length == 0) return res.status(400).json({msg: "data rambu tidak ada atau belum dibuat"});
            return res.status(200).json({data})
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
            return res.status(400).json({msg: "gagal membuat data rambu"});
        }
    }

    async updateKecamatan(req, res){
        const { kecamatan, titik_pangkal, titik_ujung } = req.body;
        const id_kecamatan = req.params.id;
        try {
            const kec = await Kecamatan.findAll({
                where: {
                    id_kecamatan
                }
            })
            if(kec.length == 0) return res.status(200).json({msg: "tidak ada kecamatan"});
            await Kecamatan.update({ id_kecamatan, kecamatan, titik_pangkal, titik_ujung }, {
                where: {
                    id_kecamatan
                }
            });

            return res.status(200).json({msg: "kecamatan sudah diupdate"});
        } catch (err) {
            return res.status(200).josn({msg: "gagal"})
        }
    }

    async updateRambu(req, res){
        const { kecamatan, jalan, jenis_rambu, gambar, kanan, kiri, tengah } = req.body;
        const id_rambu = req.params.id;
        try {
            const rambu = await Rambu.findAll({
                where: {
                    id_rambu
                }
            })
            if(rambu.length == 0) return res.status(200).json({msg: "tidak ada rambu"});
            await rambu.update({ kecamatan, jalan, jenis_rambu, gambar, kanan, kiri, tengah }, {
                where: {
                    id_rambu
                }
            });

            return res.status(200).json({msg: "kecamatan sudah diupdate"});
        } catch (err) {
            return res.status(200).josn({msg: "gagal"});
        }
    }

    async deleteKecamatan(req, res){
        const id_kecamatan = req.params.id;
        try {
            await Kecamatan.destroy({
                where: {
                    id_kecamatan
                }
            })

            return res.status(200).json({msg: "berhasil menghapus kecamatan"});
        } catch (err) {
            console.log(err);
            return res.status(400).json({msg: "gagal menghapus kecamatan"});            
        }
    }

    async deleteRambu(req, res){
        const id_rambu = req.params.id;
        try {
            await Rambu.destroy({
                where: {
                    id_rambu
                }
            })

            return res.status(200).json({msg: "berhasil menghapus rambu"});
        } catch (err) {
            console.log(err);
            return res.status(400).json({msg: "gagal menghapus rambu"});            
        }
    }
}

export const todoContorller = new TodoController();