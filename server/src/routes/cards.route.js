import { Router } from "express";

const router = Router();

router
    .route("/boards/:id/cards")
    .get()
    .post()


router
    .route("/cards/:id")
    .get()
    .patch()
    .delete()

router
    .route("/cards/:id/move")
    .patch()

export { router }