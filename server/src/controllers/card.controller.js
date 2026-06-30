import mongoose from "mongoose";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { Card } from "../models/card.model.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { cardSchema, updateCardSchema, moveCardSchema } from "../schema/card.schema.js";
import { List } from "../models/list.model.js";
import { fetchList } from "../services/fetchList.service.js";
import { fetchOrgAsMember } from "../services/fetchOrgAsMember.service.js";
import { countCardsInList } from "../services/countCardsInList.service.js";
import { fetchCard } from "../services/fetchCard.service.js";

const card = {
    create: asyncHandler(async (req, res) => {
        // fetch user details 
        const userId = req.user?._id;

        const { listId } = req.params;
        if (!mongoose.Types.ObjectId.isValid(listId)) throw new ApiError(400, "Invalid Listid format");

        const result = cardSchema.safeParse(req.body);
        if (!result.success) throw new ApiError(400, "Invalid input", result.error.flatten());

        const { title, description } = result.data;

        // fetch list 
        const list = await fetchList(listId);

        // fetch org and validate membership
        const org = await fetchOrgAsMember(list.orgId, userId);

        // count no. of cards present 
        const position = await countCardsInList(listId) + 1;

        // create card 
        const card = await Card.create({
            title: title,
            description: description,
            position: position,
            listId: listId,
            boardId: list.boardId,
            orgId: list.orgId,
            assignedTo: null,
            createdBy: userId
        })

        res
            .status(201)
            .json(new ApiResponse(201, card))
    }),

    get: asyncHandler(async (req, res) => {
        // fetch user id 
        const userId = req.user?._id;

        // fetch cardId and validate
        const { cardId } = req.params;
        if (!mongoose.Types.ObjectId.isValid(cardId)) throw new ApiError(400, "Invalid cardId format");

        // fetch card 
        const card = await fetchCard(cardId);

        // fetch org and validate membership
        const org = await fetchOrgAsMember(card.orgId, userId);

        res
            .status(200)
            .json(new ApiResponse(200, card))
    }),

    delete: asyncHandler(async (req, res) => {
        // fetch user id 
        const userId = req.user?._id;

        // fetch cardId and validate
        const { cardId } = req.params;
        if (!mongoose.Types.ObjectId.isValid(cardId)) throw new ApiError(400, "Invalid cardId format");

        // fetch card 
        const card = await fetchCard(cardId);

        // fetch org and validate membership
        const org = await fetchOrgAsMember(card.orgId, userId);

        // delete card
        await Card.findByIdAndDelete(cardId);

        res
            .status(200)
            .json(new ApiResponse(200, {}, "card deleted successfully"))
    }),

    update: asyncHandler(async (req, res) => {
        // fetch user id 
        const userId = req.user?._id;

        // fetch cardId and validate
        const { cardId } = req.params;
        if (!mongoose.Types.ObjectId.isValid(cardId)) throw new ApiError(400, "Invalid cardId format");

        // validate input - only allow specified fields
        const result = updateCardSchema.safeParse(req.body);
        if (!result.success) throw new ApiError(400, "Invalid input", result.error.flatten());

        // fetch card 
        const card = await fetchCard(cardId);

        // fetch org and validate membership
        const org = await fetchOrgAsMember(card.orgId, userId);

        // prepare update object with only provided fields
        const updateData = {};

        if (result.data.title !== undefined) updateData.title = result.data.title;
        if (result.data.description !== undefined) updateData.description = result.data.description;
        if (result.data.position !== undefined) updateData.position = result.data.position;
        if (result.data.assignedTo !== undefined) updateData.assignedTo = result.data.assignedTo;

        // if listId is being updated, validate it exists
        if (result.data.listId !== undefined) {
            const newList = await fetchList(result.data.listId);
            updateData.listId = result.data.listId;
            updateData.boardId = newList.boardId;
        }

        // update card and return new document
        const updatedCard = await Card.findByIdAndUpdate(
            cardId,
            updateData,
            { new: true }
        );

        res
            .status(200)
            .json(new ApiResponse(200, updatedCard, "card updated successfully"))
    }),

    move: asyncHandler(async (req, res) => {
        // fetch user details 
        const { cardId } = req.params;
        const userId = req.user?._id;

        // input validation 
        const result = moveCardSchema.safeParse(req.body);
        if (!result.success) throw new ApiError(400, "Invalid input", result.error.flatten());

        // fetch input 
        const { newListId, newPosition } = result.data;

        // fetch and validate card 
        const card = await fetchCard(cardId);

        // Authorization
        await fetchOrgAsMember(userId, card.orgId);

        // validate and fetch newList
        const newList = await fetchList(newListId);
        if (!newList.boardId.equals(card.boardId)) throw new ApiError(400, "New list must belong to the same board");

        // updated card
        const movedCard = await Card.findByIdAndUpdate(
            cardId,
            {
                listId: newListId,
                position: newPosition
            },
            { new: true }
        )

        res
            .status(200)
            .json(new ApiResponse(200, movedCard, "card moved successfully"))
    })
};

export { card };