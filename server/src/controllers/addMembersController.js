const addMembersController = (req, res) => {
    const memberDetails = req.memberDetails;
    const organization = req.organization;

    organization.members.push(memberDetails.id);

    return res.json({
        message: "new member added !!"
    })
};

module.exports = addMembersController;