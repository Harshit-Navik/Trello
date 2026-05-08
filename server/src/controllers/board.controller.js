import { Board } from "../models/board.model.js";
import { boardSchema, updatedBoardSchema } from "../schema/board.schema.js";
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

const getAllBoards = asyncHandler(async (req, res) => {
    // fetch and validate userId and orgId
    const userId = req.user?._id;
    const { orgId } = req.params;

    if (!mongoose.Types.ObjectId.isValid(orgId)) throw new ApiError(400, "Invalid OrgId format");

    // validate org + member
    const org = await Organization.findOne({
        _id: orgId,
        "members.userId": userId
    });
    if (!org) throw new ApiError(403, "Org doesn't exists or Access Denied !!!");


    const boards = await Board.find({ organizationId: orgId }).lean();
    if (boards.length === 0) throw new ApiError(404, "Boards not found");

    res
        .status(200)
        .json(new ApiResponse(200, boards, "Boards fetched successfully"));
})

const updateBoard = asyncHandler(async (req, res) => {
    // fetch userId and boardId and validate 
    const userId = req.user?._id;
    const { boardId } = req.params;

    if (!mongoose.Types.ObjectId.isValid(boardId)) throw new ApiError(400, "Invalid boardId format");

    // validate input
    const result = updatedBoardSchema.safeParse(req.body);
    console.log(req.body);

    if (!result.success) throw new ApiError(400, "Invalid input", result.error.flatten());

    // fetch input
    const { title, description } = result.data;

    // validate board
    const board = await Board.findById(boardId);
    if (!board) throw new ApiError(404, "Board doesn't exists");

    // fetch org
    const org = await Organization.findOne({
        _id: board.organizationId,
        createdBy: userId
    })

    if (!org) throw new ApiError(403, "Access Denied !!!");

    const updateFields = {};
    if (title !== undefined) updateFields.title = title;
    if (description !== undefined) updateFields.description = description;

    const updatedBoard = await Board.findOneAndUpdate(
        { _id: boardId },
        { $set: updateFields },
        {
            returnDocument: "after",
            runValidators: true
        }
    ).lean();


    res
        .status(200)
        .json(new ApiResponse(200, updatedBoard, "Board Updated Successfully"))


})

// will continue this and delete board after creating lists and cards 

// const getSpecificBoard = asyncHandler(async (req, res) => {
//     //fetch userId and boardId 
//     const userId = req.user?._id;
//     const { boardId } = req.params;

//     if (!mongoose.Types.ObjectId.isValid(boardId)) throw new ApiError(400, "Invalid boardId format");

//     // validate board
//     const board = await Board.findById(boardId).lean();
//     if (!board) throw new ApiError(404, "Board doesn't exists");

//     // validate membership
//     const isMember = await Organization.findOne({
//         _id: board.organizationId,
//         "members.userId": userId
//     })

//     if (!isMember) throw new ApiError(403, "Access Denied !!!");

//     res
//         .status(200)
//         .json(new ApiResponse(200, board, "Board fetched successfully !!"))
// }) 

export { createBoard, getAllBoards, updateBoard, getSpecificBoard }