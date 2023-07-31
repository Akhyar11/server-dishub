import jwt from "jsonwebtoken";

export const authRefreshToken = (req, res, next) => {
    const token = req.cookies.token;
    if(!token) return res.status(400).json({msg: "harap login dulu"});
    jwt.verify(token, process.env.REFRESH_TOKEN_SECRET, (err, decoded) => {
        if(err) return res.status(200).json({msg: "refresh token tidak cocok"});
        req.userId = decoded.userId;
        req.username = decoded.username;
        req.lavel = decoded.level;
        next()
    })
}
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
        const level = decoded.userId.split("-")[0];
        
        if(level != "Admin") return res.status(403).json({msg: "hanya admin yang dapat mengakses path ini"});
        req.level = level;
        req.userId = decoded.userId;
        next();
    });
}