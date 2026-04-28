import { Router } from "express";

const router = Router();

router
    .route("/lists/:id")
    .get()
    .patch()

router
    .route("/boards/:id/lists")
    .get()

export { router }