// middlewares/auth.js

const jwt = require("jsonwebtoken");

module.exports = (req, res, next) => {
    try {
        const token = req.headers.authorization.split(" ")[1];
        jwt.verify(token, "|1FE1sT0Os|-|0Rt");
        next();
    } catch (error) {
        res.status(401).json({ message: "No token provided" });
    }
};