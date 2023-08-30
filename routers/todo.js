import express from "express";
import multer from "multer";

// Controllers
import { todoContorller } from "../controllers/todoContorller.js";
import { authVerifyTokenForAdmin } from "../middlewares/authMiddleware.js";
import { jalanController } from "../controllers/jalanController.js";

class Todo {
  constructor() {
    this.router = express.Router();
    this.storage = multer.diskStorage({
      destination: (_, res, cb) => {
        cb(null, "./public/rambu/");
      },
      filename: (_, file, cb) => {
        cb(null, file.originalname);
      },
    });
    this.uplaod = multer({ storage: this.storage });
    this.useRouters();
  }

  useRouters() {
    // Jalan
    this.router.get("/jalan/:id", jalanController.getJalanById);
    this.router.post(
      "/jalan",
      authVerifyTokenForAdmin,
      jalanController.addJalan
    );
    this.router.post(
      "/jalan/update/:id",
      authVerifyTokenForAdmin,
      jalanController.updateJalan
    );
    this.router.get("/jalan/rambu/:id", jalanController.getJalanWithRambuById);
    this.router.delete(
      "/jalan/:id",
      authVerifyTokenForAdmin,
      jalanController.deleteJalan
    );

    // Rambu
    this.router.get("/", todoContorller.getAll);
    this.router.get("/:id", todoContorller.getJalanRambu);
    this.router.get("/rambu/:id", todoContorller.getRambuByPencarian);
    this.router.get("/get/rambu/id/:id", todoContorller.getRambu);
    this.router.post("/", authVerifyTokenForAdmin, todoContorller.createTodo);
    this.router.delete(
      "/rambu/:id",
      authVerifyTokenForAdmin,
      todoContorller.deleteRambu
    );
    this.router.put(
      "/update/rambu/:id",
      authVerifyTokenForAdmin,
      todoContorller.updateRambu
    );
    this.router.post(
      "/rambu/gambar/:id",
      this.uplaod.single("jalan"),
      todoContorller.addGambarStatus
    );
    this.router.post("/rambu/gambar/status/:id", todoContorller.addStatus);
    this.router.put(
      "/update/rambu/gambar/:id",
      this.uplaod.single("jalan"),
      todoContorller.UpdateStatus
    );
    this.router.delete(
      "/delate/jalan/gambar/:id",
      todoContorller.delatePicture
    );
  }
}

export default new Todo().router;
