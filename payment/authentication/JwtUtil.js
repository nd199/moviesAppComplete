const jwt = require('jsonwebtoken');

const authenticationToken = (req, res, next) => {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
        return res.status(401).json({error: "You are not authenticated!"});
    }
    const token = authHeader?.split(' ')[1];
    const secretKey = process.env.JWT_SECRET;

    jwt.verify(token, secretKey, (err, decoded) => {
        if (err) {
            console.error("JWT verification error:", err);
            return res.status(401).json({error: "Failed to authenticate token."});
        }
        req.decoded = decoded;
        console.log("Token verification successful");
        next();
    });
}