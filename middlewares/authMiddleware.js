import jwt from "jsonwebtoken";

export const authVerifyToken = (req, res, next) => {
    const authHeader = req.headers["authorization"];
    const token = authHeader && authHeader.split(" ")[1];
    if(token == null) return res.status(401).json({msg: "tidak ada token"});
    jwt.verify(token, process.env.ACCSESS_TOKEN_SECRET, (err, decoded) => {
        if(err) return res.sendStatus(403);

        req.level = decoded.level;
        req.userId = decoded.userId;
        next();
    });
}

export const authVerifyTokenForAdmin = (req, res, next) => {
    const authHeader = req.headers["authorization"];
    const token = authHeader && authHeader.split(" ")[1];
    if(token == null) return res.status(401).json({msg: "tidak ada token"});
    jwt.verify(token, process.env.ACCSESS_TOKEN_SECRET, (err, decoded) => {
        if(err) return res.status(403).json({msg: "akses token tidak cocok"});
        const level = decoded.level;

        if(level != "Admin") return res.sendStatus(403);
        req.level = level;
        req.userId = decoded.userId;
        next();
    });
}