import { Router } from "express";
// import cardRouter from "./cards.route.js";
// import listRouter from "./lists.route.js";

import { createBoard } from "../controllers/board.controller.js";
import authMiddleware from "../middlewares/auth.middleware.js";

const router = Router({ mergeParams: true });

router
    .route("/").post(authMiddleware, createBoard) // to create board 
//     .get() // to get all boards


// router
//     .route("/:boardId")
//     .get() // get specific board
//     .patch() // update board
//     .delete() // delete board

// router.use("/:boardId/lists", listRouter);


export default router;