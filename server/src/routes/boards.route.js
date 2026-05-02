import { Router } from "express";
// import cardRouter from "./cards.route.js";
// import listRouter from "./lists.route.js";

import { createBoard, getAllBoards, updateBoard } from "../controllers/board.controller.js";
import authMiddleware from "../middlewares/auth.middleware.js";

const router = Router({ mergeParams: true });

router
    .route("/").post(authMiddleware, createBoard) // to create board 
    .get(authMiddleware, getAllBoards) // to get all boards


router
    .route("/:boardId")
    .patch(authMiddleware, updateBoard) // update board
//     .get() // get specific board
//     .delete() // delete board

// router.use("/:boardId/lists", listRouter);


export default router;