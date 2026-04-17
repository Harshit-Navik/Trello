import { Router } from "express";
import { registerUser, logInUser, logOutUser } from "../controllers/user.controller.js";
import authMiddleware from "../middlewares/auth.middleware.js";
const router = Router();

router.route("/register").post(registerUser)
router.route("/login").post(logInUser)


// secured routes 

router.route("/logout").post(authMiddleware, logOutUser)

export default router;