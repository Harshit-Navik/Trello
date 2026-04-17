import { Router } from "express";
import { registerUser, logInUser, logOutUser, refreshAccessToken } from "../controllers/user.controller.js";
import authMiddleware from "../middlewares/auth.middleware.js";

const router = Router();

router.route("/register").post(registerUser)
router.route("/login").post(logInUser)


// secured routes 

router.route("/logout").post(authMiddleware, logOutUser)
router.route("/refresh-token").post(authMiddleware , refreshAccessToken)

export default router;