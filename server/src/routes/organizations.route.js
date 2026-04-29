import { Router } from "express";
import boardRouter from "./boards.route.js"

const router = Router();

router
    .route("/")
    .get() // get all org 
    .post() // create an org 

router
    .route("/:orgId")
    .get() // get specific org 
    .patch() // update org
    .delete() // delete org 

router
    .route("/:orgId/members")
    .post() // add member

router
    .route("/:orgId/members/:membersId")
    .delete() // remove member 

router.use("/:orgId/boards" , boardRouter)

export default router;