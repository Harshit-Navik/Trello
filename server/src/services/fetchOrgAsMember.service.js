import { Organization } from "../models/organization.model.js";

export const fetchOrgAsMember = async (orgId , userId) => {
    return Organization.findOne({
        _id: orgId,
        "members.userId": userId
    });
}
