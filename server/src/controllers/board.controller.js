import { Board } from "../models/board.model.js";
import { boardSchema } from "../schema/board.schema.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import mongoose from "mongoose";
import { Organization } from "../models/organization.model.js";
import { List } from "../models/list.model.js";
import { ApiResponse } from "../utils/ApiResponse.js";

const createBoard = asyncHandler(async (req, res) => {
    // fetch and validate userId and orgId
    const userId = req.user._id;
    const { orgId } = req.params;

    if (!mongoose.Types.ObjectId.isValid(orgId)) throw new ApiError(400, "Invalid OrgId format");

    // validate input 
    const result = boardSchema.safeParse(req.body);
    if (!result.success) throw new ApiError(400, "Invalid input", result.error.flatten());

    // fetch input
    const { title, description } = result.data;

    // validate org 
    const org = await Organization.findById(orgId);
    if (!org) throw new ApiError(404, "Org doesn't exists");

    // validate is user admin or not 
    if (org.createdBy.toString() !== userId.toString()) throw new ApiError(403, "Only admins can create board")

    // create board
    const board = await Board.create({
        title,
        description,
        createdBy: userId,
        organizationId: orgId
    });

    // default lists
    const titles = ["To Do", "In Progress", "Under Review", "Completed"];

    const listData = titles.map((title, index) => ({
        title,
        boardId: board._id,
        position: index + 1
    }));

    const lists = await List.insertMany(listData);

    res
        .status(201)
        .json(new ApiResponse(201, { board, lists }, "Board with respective list created successfully"))

});

export { createBoard }