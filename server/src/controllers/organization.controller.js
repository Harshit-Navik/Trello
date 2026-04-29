import { Organization } from "../models/organization.model.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { createOrg, memberInput } from "../schema/org.schema.js";
import { ApiError } from "../utils/ApiError.js";
import { success } from "zod";
import User from "../models/user.model.js";

const createOrganization = asyncHandler(async (req, res) => {
    // fetch user data 
    const userId = req.user?._id;

    // validate input 
    const result = createOrg.safeParse(req.body);
    if (!result.success) throw new ApiError(400, "Invalid Input", result.error.flatten());

    const { title } = result.data;

    const org = await Organization.create({
        title,
        createdBy: userId,

        members: [
            {
                userId: userId,
                role: "admin"
            }
        ]
    })

    res.status(201).json({
        success: true,
        data: org
    })
})

const getAllOrganization = asyncHandler(async (req, res) => {
    const userId = req.user?._id;

    const orgs = await Organization.find({ createdBy: userId });

    return res.status(200).json({
        success: true,
        count: orgs.length,
        data: orgs
    })
})

const getParticularOrganization = asyncHandler(async (req, res) => {
    const orgId = req.params.orgId;

    const org = await Organization.findById(orgId);

    if (!org) throw new ApiError(400, "Organization with given id doesnt exist");

    res.status(200).json({
        success: true,
        message: "organization fetched successfully",
        data: org
    })
})

const addMember = asyncHandler(async (req, res) => {
    // fetch data and validate 
    const result = memberInput.safeParse(req.body);
    if (!result.success) throw new ApiError(400, "Invalid member inputs");

    const { email: memberEmail } = result.data;

    const orgId = req.params.orgId;

    // Find org
    const org = await Organization.findById(orgId);
    if (!org) throw new ApiError(404, "Organization not found");

    // Authorization (admin only)
    const currentUserId = req.user._id;

    const currentMember = org.members.find(
        m => m.userId.toString() === currentUserId.toString()
    );

    if (!currentMember || currentMember.role !== "admin") throw new ApiError(403, "Only admins can add members");

    // Find user by email
    const user = await User.findOne({ email: memberEmail });
    if (!user) throw new ApiError(404, "User with this email not found");

    // Prevent duplicate
    const alreadyMember = org.members.some(
        m => m.userId.toString() === user._id.toString()
    );

    if (alreadyMember) throw new ApiError(400, "User already a member");

    // Add member
    org.members.push({
        userId: user._id,
        role: "member"
    });

    await org.save();

    res.status(200).json({
        success: true,
        message: "Member added successfully",
        data: org
    });
})



export { createOrganization, getAllOrganization, getParticularOrganization, addMember }