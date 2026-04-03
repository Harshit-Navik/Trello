const jwt = require("jsonwebtoken");
require("dotenv").config();

const authMiddleware = (req, res, next) => {
    const token = req.headers.token;

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const UserId = decoded.UserId;

    if (UserId) {
        req.UserId = UserId;
        next();
    } else {
        return res.status(403).json({
            message: "something went wrong"
        })
    }

}



module.exports = authMiddleware ;