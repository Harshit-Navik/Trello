import { Organization } from "../models/organization.model.js"
import { fetchOrgAsMember } from "./fetchOrgAsMember.service.js"
import { ApiError } from "../utils/ApiError.js";

export const fetchOrgAsAdmin = async (orgId, userId) => {
    const org = await fetchOrgAsMember(orgId, userId);

    const isAdmin = org.members.some(m => m.userId.toString() === userId.toString() && m.role === "admin");
    if (!isAdmin) throw new ApiError(403, "Not authorized as admin");

    return org;
}