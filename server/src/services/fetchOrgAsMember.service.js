import { Organization } from "../models/organization.model.js";
import { ApiError } from "../utils/ApiError.js";

export const fetchOrgAsMember = async (orgId , userId) => {
    const org = await Organization.findOne({
        _id: orgId,
        "members.userId": userId
    });

    if(!org) throw new ApiError(404, "either org doesn't exists or user is not member of org");

    return org;
}
