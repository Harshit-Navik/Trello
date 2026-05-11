import { Router } from "express";
import { verifyJwt } from "../middlewares/auth.middleware.js";
import { card } from "../controllers/card.controller.js";

// Router for creating cards (needs listId)
const createCardRouter = Router({ mergeParams: true });

createCardRouter.use(verifyJwt);

createCardRouter
    .route("/")
    .post(card.create);

// Router for card operations (get, update, delete)
const cardOperationsRouter = Router();

cardOperationsRouter
    .use(verifyJwt);

cardOperationsRouter
    .route("/:cardId")
    .get(card.get)
    .patch(card.update)
    .delete(card.delete);

export { createCardRouter, cardOperationsRouter };