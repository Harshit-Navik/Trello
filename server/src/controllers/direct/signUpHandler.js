const data = require("../../../data");
const { users, organizations, issues, boards } = data;
const signUpHandler = (req, res) => {
    const username = req.body.username;
    const password = req.body.password;

    const UserExists = users.find(user => user.username == username);
    if (UserExists) {
        res.status(411).json({
            message: "user already exists"
        })
        return;
    }

    users.push({
        username,
        password,
        id: USER_ID++
    })

    res.status(200).json({ username, password });
    return;
};

module.exports = signUpHandler;