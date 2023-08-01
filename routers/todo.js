import express from "express";
import multer from "multer";

// Controllers
import { todoContorller } from "../controllers/todoContorller.js";
import { authVerifyToken, authVerifyTokenForAdmin } from "../middlewares/authMiddleware.js";

class Todo{
    constructor(){
        this.router = express.Router();
        this.storage = multer.diskStorage({
            destination: (req, res, cb) => {
                cb(null, "./public/rambu/");
            },
            filename: (req, file, cb) => {
                cb(null, file.originalname);
            }
        })
        this.uplaod = multer({storage: this.storage})
        this.useRouters();
    }

    useRouters(){
        this.router.get("/", authVerifyToken, todoContorller.getAll);
        this.router.post("/", authVerifyTokenForAdmin, todoContorller.createTodo);
        this.router.delete("/kecamatan/:id", authVerifyTokenForAdmin, todoContorller.deleteKecamatan);
        this.router.delete("/rambu/:id", authVerifyTokenForAdmin, todoContorller.deleteRambu);
        this.router.put("/update/rambu/:id", authVerifyTokenForAdmin, todoContorller.updateRambu);
        this.router.put("/update/kecamatan/:id", authVerifyTokenForAdmin, todoContorller.updateKecamatan);
        this.router.put("/add/picture/:id", this.uplaod.single("picture"), todoContorller.addPicture);
        this.router.put("/update/picture/:id", this.uplaod.single("picture"), todoContorller.updatePicture);
        this.router.delete("/delate/picture/:id", todoContorller.delatePicture);
    }
}

export default new Todo().router;