import { Card } from "../models/card.model.js"
import { List } from "../models/list.model.js"
import { ApiError } from "../utils/ApiError.js";

export const countCardsInList = async (listId) => {
    const list = await List.findById(listId);
    if (!list) throw new ApiError(404, "List doesn't exist");
    
    return await Card.countDocuments({ listId });
}
