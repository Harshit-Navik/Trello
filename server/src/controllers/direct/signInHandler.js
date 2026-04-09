const jwt = require("jsonwebtoken");
require("dotenv").config();

const signInHandler = (req, res) => {
    const username = req.body.username;
    const password = req.body.password;

    const UserExists = users.find(user => user.username == username && user.password == password);
    if (!UserExists) {
        res.status(403).json({
            message: "invalid credentials"
        })
        return;
    }

    const token = jwt.sign({ UserId: UserExists.id, username: UserExists.username }, process.env.JWT_SECRET);
    UserExists.token = token;
    res.json({ token, UserExists });
};

module.exports = signInHandler;