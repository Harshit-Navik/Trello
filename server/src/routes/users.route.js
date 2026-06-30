import { Router } from "express";
import { user } from "../controllers/user.controller.js";
import verifyJWT from "../middlewares/auth.middleware.js";

const router = Router();

router
    .route("/register")
    .post(user.register)

router
    .route("/login")
    .post(user.login)


// secured routes 

router.use(verifyJWT)

router
    .route("/logout")
    .post(user.logout)

router
    .route("/token")
    .post(user.refreshToken)

router
    .route("/password")
    .patch(user.changePassword)

router
    .route("/")
    .get(user.getCurrentUser)

export default router;