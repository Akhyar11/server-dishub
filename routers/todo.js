import express from "express";

// Controllers
import { todoContorller } from "../controllers/todoContorller.js";
import { authVerifyToken, authVerifyTokenForAdmin } from "../middlewares/authMiddleware.js";

class Todo{
    constructor(){
        this.router = express.Router();
        this.useRouters();
    }

    useRouters(){
        this.router.get("/", authVerifyToken, todoContorller.getAll);
        this.router.post("/", authVerifyTokenForAdmin, todoContorller.createTodo);
        this.router.delete("/kecamatan/:id", authVerifyTokenForAdmin, todoContorller.deleteKecamatan);
        this.router.delete("/rambu/:id", authVerifyTokenForAdmin, todoContorller.deleteRambu);
        this.router.put("/update/rambu/:id", authVerifyTokenForAdmin, todoContorller.updateRambu);
        this.router.put("/update/kecamatan/:id", authVerifyTokenForAdmin, todoContorller.updateKecamatan);
    }
}

export default new Todo().router;