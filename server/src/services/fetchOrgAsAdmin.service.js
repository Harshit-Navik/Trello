import { Organization } from "../models/organization.model.js"
import { fetchOrgAsMember } from "./fetchOrgAsMember.service.js"

export const fetchOrgAsAdmin = async (orgId, userId) => {
    const org = await fetchOrgAsMember(orgId, userId);
    if (!org) return null;

    const isAdmin = org.members.some(m => m.userId.toString() === userId.toString() && m.role === "admin");
    if (!isAdmin) return null;
    
    return org;
}