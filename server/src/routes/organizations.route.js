import { Router } from "express";
// import boardRouter from "./boards.route.js"
// import { createOrg } from "../schema/org.schema.js";
import { addMember, createOrganization, getAllOrganization, getParticularOrganization } from "../controllers/organization.controller.js";
import authMiddleware from "../middlewares/auth.middleware.js";

const router = Router();

router
    .route("/").post(authMiddleware, createOrganization)
    .get(authMiddleware, getAllOrganization) // get all org 

router
    .route("/:orgId")
    .get(authMiddleware, getParticularOrganization) // get specific org 
//     .patch() // update org   
//     .delete() // delete org 

router
    .route("/:orgId/members")
    .post(authMiddleware, addMember) // add member

// router
//     .route("/:orgId/members/:membersId")
//     .delete() // remove member 

// router.use("/:orgId/boards" , boardRouter)

export default router;