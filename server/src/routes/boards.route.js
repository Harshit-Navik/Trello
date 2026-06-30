import { Router } from "express";
// import cardRouter from "./cards.route.js";
// import listRouter from "./lists.route.js";

import { board } from "../controllers/board.controller.js";
import verifyJWT from "../middlewares/auth.middleware.js";

const router = Router({ mergeParams: true });

router.use(verifyJWT)

router
    .route("/")
    .post(board.create) // to create board 
    .get(board.getAll) // to get all boards 


router
    .route("/:boardId")
    .patch(board.update) // update board
//     .get() // get specific board
//     .delete() // delete board


export default router;