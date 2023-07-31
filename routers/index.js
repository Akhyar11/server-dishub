import express from "express";

// Controllers
import { userController } from "../controllers/userController.js";
import { adminController } from "../controllers/adminController.js";

class Authentication{
    constructor(){
        this.router = express.Router();
        this.useRouters();
    }

    useRouters(){
        // Users general
        this.router.post("/login", userController.login);
        this.router.post("/register", userController.register);

        // // User admin
        this.router.post("/login/admin", adminController.login);
        this.router.post("/register/admin", adminController.register);
        
        // General routers
        this.router.delete("/logout", userController.logout);
    }
}

export default new Authentication().router;