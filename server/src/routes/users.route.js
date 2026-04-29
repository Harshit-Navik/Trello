import { Router } from "express";
import { registerUser, logInUser, logOutUser, refreshAccessToken, changePassword, getCurrentUser } from "../controllers/user.controller.js";
import authMiddleware from "../middlewares/auth.middleware.js";

const router = Router();

router
    .route("/register")
    .post(registerUser)
    
router
    .route("/login")
    .post(logInUser)


// secured routes 

router
    .route("/logout")
    .post(authMiddleware, logOutUser)

router
    .route("/token")
    .post(authMiddleware, refreshAccessToken)

router
    .route("/password")
    .patch(authMiddleware, changePassword)

router
    .route("/me")
    .get(authMiddleware, getCurrentUser)

export default router;