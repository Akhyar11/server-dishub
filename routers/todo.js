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
    this.router.get("/", todoContorller.getAll);
    this.router.get("/jalan/:id", todoContorller.getJalanById);
    this.router.get("/jalan/:id", jalanController.getJalanById);
    this.router.get("/jalan/gambar/:id", jalanController.getPicture);
    this.router.get("/jalan/rambu/:id", jalanController.getJalanWithRambuById);
    this.router.delete(
      "/jalan/:id",
      authVerifyTokenForAdmin,
      jalanController.deleteJalan
    );
    this.router.post(
      "/jalan/gambar",
      this.uplaod.single("picture"),
      jalanController.addPicture
    );
    this.router.delete("/delate/jalan/gambar", jalanController.delatePicture);
    this.router.post("/", todoContorller.createTodo);
    this.router.delete(
      "/kecamatan/:id",
      authVerifyTokenForAdmin,
      todoContorller.deleteKecamatan
    );
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
    this.router.put(
      "/update/kecamatan/:id",
      authVerifyTokenForAdmin,
      todoContorller.updateKecamatan
    );
    this.router.put(
      "/add/picture/:id",
      this.uplaod.single("picture"),
      todoContorller.addPicture
    );
    this.router.put(
      "/update/picture/:id",
      this.uplaod.single("picture"),
      todoContorller.updatePicture
    );
    this.router.delete("/delate/picture/:id", todoContorller.delatePicture);
  }
}

export default new Todo().router;
