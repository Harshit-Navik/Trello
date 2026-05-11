import { Router } from "express";
import boardRouter from "./boards.route.js"
import { organization } from "../controllers/organization.controller.js";
import authMiddleware from "../middlewares/auth.middleware.js";

const router = Router();

router
    .route("/").post(authMiddleware, organization.create)
    .get(authMiddleware, organization.getAll) // get all org 

router
    .route("/:orgId")
    .get(authMiddleware, organization.getParticular) // get specific org 
    .patch(authMiddleware, organization.updateTitle) // update org   
//     .delete() // delete org 

router
    .route("/:orgId/members")
    .post(authMiddleware, organization.addMember) // add member

router
    .route("/:orgId/members/:memberId")
    .delete(authMiddleware, organization.removeMember) // remove member 

router.use("/:orgId/boards" , boardRouter)

export default router;