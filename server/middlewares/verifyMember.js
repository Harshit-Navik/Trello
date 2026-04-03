const data = require("../data");
const { users } = data;

const verifyMember = (req, res, next) => {
    const memberUsername = req.body.email;

    const MemberDetails = users.find(user => user.username == memberUsername);

    if (!MemberDetails) {
        res.status(411).json({
            message: "something went wrong"
        })
    }

    req.memberDetails = MemberDetails;
    next();
}

module.exports = verifyMember;