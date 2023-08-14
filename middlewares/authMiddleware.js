import jwt from "jsonwebtoken";
import Admin from "../models/adminModel.js";

export const authRefreshToken = async (req, res, next) => {
  const { username } = req.body;
  try {
    const admin = await Admin.findAll({ where: { username } });
    const token = admin[0].token;
    jwt.verify(token, process.env.REFRESH_TOKEN_SECRET, (err, decoded) => {
      if (err) return res.status(400).json({ msg: "Harap login dulu" });
      req.userId = decoded.userId;
      req.username = decoded.username;
      req.lavel = decoded.level;
      next();
    });
  } catch (err) {
    console.log(err);
  }
};
export const authVerifyToken = (req, res, next) => {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];
  if (token == null) return res.status(401).json({ msg: "tidak ada token" });
  jwt.verify(token, process.env.ACCSESS_TOKEN_SECRET, (err, decoded) => {
    if (err) return res.sendStatus(403);

    req.level = decoded.level;
    req.userId = decoded.userId;
    next();
  });
};

export const authVerifyTokenForAdmin = (req, res, next) => {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];
  if (token == null) return res.status(401).json({ msg: "tidak ada token" });
  jwt.verify(token, process.env.ACCSESS_TOKEN_SECRET, (err, decoded) => {
    if (err) return res.status(403).json({ msg: "akses token tidak cocok" });
    const level = decoded.level;
    console.log(decoded);

    if (level != "Admin")
      return res
        .status(403)
        .json({ msg: "hanya admin yang dapat mengakses path ini" });
    req.level = level;
    req.userId = decoded.userId;
    next();
  });
};