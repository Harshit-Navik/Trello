import { Organization } from "../models/organization.model.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { createOrg, memberInput, title } from "../schema/org.schema.js";
import { ApiError } from "../utils/ApiError.js";
import { success } from "zod";
import User from "../models/user.model.js";
import mongoose from "mongoose";

const organization = {
    create: asyncHandler(async (req, res) => {
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
    }),

    getAll: asyncHandler(async (req, res) => {
    const userId = req.user?._id;

    const orgs = await Organization.find({
        $or: [
            { createdBy: userId },
            { "members.userId": userId }
        ]
    }).lean(); // returns plain js obj, instead of mongoose document

    if (orgs.length === 0) throw new ApiError(403, "You are not associated with any org");

    res.status(200).json({
        success: true,
        count: orgs.length,
        data: orgs
    })
    }),

    getParticular: asyncHandler(async (req, res) => {
    // fetch data
    const orgId = req.params.orgId;
    const memberId = req.user?._id;

    // validate org
    const org = await Organization.findById(orgId);
    if (!org) throw new ApiError(404, "Organization not found");

    // validate is user associated with org or not
    const member = org.members.find(m => m.userId.toString() === memberId.toString())
    if (!member) throw new ApiError(404, "No Access")

    res.status(200).json({
        success: true,
        message: "organization fetched successfully",
        data: {
            orgId: org._id,
            title: org.title,
        }
    })
    }),

    addMember: asyncHandler(async (req, res) => {
    // fetch data and validate 
    const result = memberInput.safeParse(req.body);
    if (!result.success) throw new ApiError(400, "Invalid member inputs", result.error.flatten());

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
    }),

    updateTitle: asyncHandler(async (req, res) => {
    // fetch and validate title
    const result = title.safeParse(req.body);
    if (!result.success) throw new ApiError(400, "invalid input", result.error.flatten())

    const { title: newTitle } = result.data;

    // fetch orgId and userId
    const orgId = req.params?.orgId;
    const userId = req.user._id;

    // validate orgId
    if (!orgId) throw new ApiError(400, "OrgId is required");
    if (!mongoose.Types.ObjectId.isValid(orgId)) throw new ApiError(400, "Invalid OrgId format");

    // fectch org and validate
    const org = await Organization.findById(orgId);
    if (!org) throw new ApiError(404, "Org not found");

    // check is user Admin or not 
    const isAdmin = org.createdBy.toString() === userId.toString();
    if (!isAdmin) throw new ApiError(403, "only admins can update org title");

    org.title = newTitle;
    await org.save();

    res
        .status(200)
        .json({
            success: true,
            message: "org title updated successfully",
            data: {
                updatedTitle: org.title
            }
        })
    }),

    removeMember: asyncHandler(async (req, res) => {
    // fetch details 
    const userId = req.user?._id;
    
    const { orgId, memberId } = req.params;
    
    // validate user 
    if (!mongoose.Types.ObjectId.isValid(orgId)) throw new ApiError(400, "Invalid OrgId format");
    if (!mongoose.Types.ObjectId.isValid(memberId)) throw new ApiError(400, "Invalid MemberId format");

    // fetch and validate org 
    const org = await Organization.findById(orgId);
    if (!org) throw new ApiError(404, "Org doesnt exist");

    // is the requester Admin 
    const isAdmin = org?.createdBy?.toString() === userId.toString();
    if (!isAdmin) throw new ApiError(403, "Only admins can remove user");

    // validate if user to remove is a part of org or not 
    const member = org.members.find(m => m?.userId.toString() === memberId.toString());
    if (!member) throw new ApiError(404, "User is not associated with this organization");

    // check if user to remove is admin 
    if (member.role === "admin") throw new ApiError(403, "Cannot remove admin");

    // remove requested user and update org 

    const updateOrg = await Organization.updateOne(
        { _id: orgId },
        { $pull: { members: { userId: memberId } } } // it remove array elements that match a filter condition { userId: memberId}   
    );

    const updatedOrg = await Organization.findById(orgId);

    res
        .status(200)
        .json({
            success: true,
            message: "requested user removed successfully",
            data: updatedOrg
        })
    })
};

export { organization };