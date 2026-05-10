import { Card } from "../models/card.model.js"

export const countCardsInList = async (listId) => {
    return await Card.countDocuments({ listId });
}
