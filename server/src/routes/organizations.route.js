import { Router } from "express";
import boardRouter from "./boards.route.js"
import { organization } from "../controllers/organization.controller.js";
import verifyJWT from "../middlewares/auth.middleware.js";

const router = Router();

router.use(verifyJWT)

router
    .route("/").post(organization.create)
    .get(organization.getAll) // get all org 

router
    .route("/:orgId")
    .get(organization.getParticular) // get specific org 
    .patch(organization.updateTitle) // update org   
//     .delete() // delete org 

router
    .route("/:orgId/members")
    .post(organization.addMember) // add member

router
    .route("/:orgId/members/:memberId")
    .delete(organization.removeMember) // remove member 

router.use("/:orgId/boards", boardRouter)

export default router;