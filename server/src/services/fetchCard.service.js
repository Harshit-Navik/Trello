import { Card } from "../models/card.model.js"
import { ApiError } from "../utils/ApiError.js";

export const fetchCard = async (cardId) => {
    const card = await Card.findById(cardId).lean();
    if(!card) throw new ApiError(404, "Card doesn't exists");

    return card;
}