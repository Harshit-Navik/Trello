import { Router } from "express";
import { verifyJwt } from "../middlewares/auth.middleware.js";
import {
    createCard,
    getCard,
    deleteCard,
    updateCard
} from "../controllers/card.controller.js";

// Router for creating cards (needs listId)
const createCardRouter = Router({ mergeParams: true });

createCardRouter.use(verifyJwt);

createCardRouter
    .route("/")
    .post(createCard);

// Router for card operations (get, update, delete)
const cardOperationsRouter = Router();

cardOperationsRouter
    .use(verifyJwt);

cardOperationsRouter
    .route("/:cardId")
    .get(getCard)
    .patch(updateCard)
    .delete(deleteCard);

export { createCardRouter, cardOperationsRouter };