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
        this.router.post("/", authVerifyTokenForAdmin, todoContorller.createTodo)
    }
}

export default new Todo().router;