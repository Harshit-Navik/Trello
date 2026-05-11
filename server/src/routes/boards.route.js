import { Router } from "express";
// import cardRouter from "./cards.route.js";
// import listRouter from "./lists.route.js";

import { board } from "../controllers/board.controller.js";
import authMiddleware from "../middlewares/auth.middleware.js";

const router = Router({ mergeParams: true });

router
    .route("/").post(authMiddleware, board.create) // to create board 
    .get(authMiddleware, board.getAll) // to get all boards


router
    .route("/:boardId")
    .patch(authMiddleware, board.update) // update board
//     .get() // get specific board
//     .delete() // delete board

router
    .route("/:boardId/lists")
    .get(listRouter);

export default router;