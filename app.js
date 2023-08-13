import express from "express";
import cookieParser from "cookie-parser";
import cors from "cors";
import path from "path";
import db from "./utils/connection.js";
import Authentication from "./routers/auth.js";
import dotenv from "dotenv";
import Todo from "./routers/todo.js";

class App {
  constructor() {
    this.app = express();
    dotenv.config();
  }

  async connection() {
    try {
      await db.authenticate();
      console.log("Databese connection...");
    } catch (err) {
      console.log(err);
    }
  }

  plugins() {
    this.app.use("/public", express.static(path.join("public")));
    this.app.use(cors());
    this.app.use(express.json());
    this.app.use(cookieParser());
  }

  router() {
    // Auth
    this.app.use("/api/v1/auth", Authentication);

    // Todo
    this.app.use("/api/v1/todo/", Todo);
  }
}

const server = new App();
const port = 5000;

server.connection();
server.plugins();
server.router();
server.app.listen(port, () =>
  console.log("Server berjalan di http://localhost:" + port)
);
