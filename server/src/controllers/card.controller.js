import mongoose from "mongoose";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { Card } from "../models/card.model.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { cardSchema } from "../schema/card.schema.js";
import { List } from "../models/list.model.js";
import { fetchList } from "../services/fetchList.service.js";
import { fetchOrgAsMember } from "../services/fetchOrgAsMember.service.js";
import { countCardsInList } from "../services/countCardsInList.service.js";
import { fetchCard } from "../services/fetchCard.service.js";

const createCard = asyncHandler(async (req, res) => {
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

});

const getCard = asyncHandler(async (req, res) => {
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
})

export { createCard, getCard };