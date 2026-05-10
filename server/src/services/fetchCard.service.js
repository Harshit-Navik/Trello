import { Card } from "../models/card.model.js"

export const fetchCard = async (cardId) => {
    return Card.findById(cardId).lean();
}