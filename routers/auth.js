import express from "express";
import jwt from "jsonwebtoken";

// Controllers
import { userController } from "../controllers/userController.js";
import { adminController } from "../controllers/adminController.js";
import { authRefreshToken } from "../middlewares/authMiddleware.js";

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
        this.router.post("/token", authRefreshToken, (req, res) => {
          const userId = req.userId;
          const username = req.username;
          const level = "Admin";

          const accsessToken = jwt.sign(
            { userId, username, level },
            process.env.ACCSESS_TOKEN_SECRET,
            { expiresIn: "20s" }
          );
          res.status(200).json({ accsessToken });
        });
    }
}

export default new Authentication().router;