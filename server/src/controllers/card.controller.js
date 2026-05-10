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

    return res
        .status(201)
        .json(new ApiResponse(201, card))

});

export { createCard };