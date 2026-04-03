const data = require("./data");
const express = require("express");
const { users, organizations, issues, boards } = data;
const  authMiddleware  = require("./middlewares/authMiddleware");
const verifyMember = require("./middlewares/verifyMember");
const verifyOrg = require("./middlewares/verifyOrg");
const signUpHandler = require("./controllers/signUpHandler");
const signInHandler = require("./controllers/signInHandler");
const organizationHandler = require("./controllers/organizationHandler");
const addMembersController = require("./controllers/addMembersController");
const jwt = require("jsonwebtoken");
require("dotenv").config();



let ORGANIZATION_ID = 1;
let USER_ID = 1;
let BOARD_ID = 1;
let ISSUE_ID = 1;
const app = express();

app.use(express.json());

//  ------------------------- Post endpoints ----------------------------------

app.post("/signup", signUpHandler);

app.post("/signin", signInHandler);

app.post("/organization", authMiddleware, organizationHandler);

app.post("/add-member-to-organization", authMiddleware, verifyOrg, verifyMember, addMembersController )


app.post("/board", authMiddleware, verifyOrg, (req, res) => {
    const UserId = req.USER_ID;

    const UserExists = organizations.map(org => org.admin == UserId)
});

app.post("/issue", (req, res) => {

});

// ----------------------------- get endpoints -------------------------------- 

app.get("/organization/:organizationId", (req, res) => {

})


//------------------------------- delete endpoints ------------------------------------------------

app.delete("/members", (req, res) => {
    const UserId = req.UserId;
    const organizationId = req.body.organizationId;
    const memberUsername = req.body.email;

    const organization = organizations.find(org => org.id == organizationId)

    if (!organization || organization.admin != UserId) {
        res.status(411).json({
            message: "either this org doesnt exist or you are not admin"
        })

        return;
    }

    const MemberUsername = users.find(user => user.username == memberUsername);

    if (!MemberUsername) {
        res.status(411).json({
            message: "something went wrong"
        })
    }
    organization.members = organization.members.filter(user => user.id != memberUsername.id);

    res.json({
        message: "deleted member !!"
    })

})








app.listen(3000);

