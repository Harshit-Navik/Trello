const organizationHandler = (req, res) => {
    const UserId = req.UserId;

    organizations.push({
        id: ORGANIZATION_ID++,
        title: req.body.title,
        description: req.body.description,
        admin: UserId,
        members: []
    })
    return res.status(200).json({
        message: "organization created successfully",
        id: ORGANIZATION_ID - 1,
    })
};

module.exports = organizationHandler;