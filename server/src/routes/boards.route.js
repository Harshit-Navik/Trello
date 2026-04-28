import { Router } from "express";

const router = Router();

router
    .route("/organizations/:id/boards")
    .get()
    .post()

router
    .route("/boards/:id")
    .get()
    .patch()
    .delete()

export { router }