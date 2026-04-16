import { Router } from "express";
import { registerUser, loginUser } from "../controllers/main/user.controller";
import authMiddleware from "../middlewares/auth.middleware.js";
const router = Router();

router.route("/signUp").post(registerUser)
router.route("/login").post(loginUser)


// secured routes 

router.route("./logOut").post(authMiddleware, logOutUser)

export default router;