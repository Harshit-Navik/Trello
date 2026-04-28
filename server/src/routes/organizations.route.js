import { Router } from "express";


const router = Router();

router
    .route("/organizations")
    .get()
    .post()

router
    .route("/organizations/:id")
    .get()
    .patch()
    .delete()

router
    .route("/organizations/:id/members")
    .post()

router
    .route("/organizations/:id/members/:membersId")
    .delete()


export { router }