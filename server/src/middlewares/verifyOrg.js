const data = require("../../data");
const { organizations } = data;

const verifyOrg = (req, res, next) => {
    const UserId = req.UserId;
    const organizationId = req.body.organizationId;

    const organization = organizations.find(org => org.id == organizationId)

    if (!organization || organization.admin != UserId) {
        return res.status(403).json({
            message: "either this org doesnt exist or you are not admin"
        });
    }

    req.organization = organization;

    return res.json({
        message: "organization exists"
    })
};

module.exports = verifyOrg;