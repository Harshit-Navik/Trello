import { Router } from "express";
import { registerUser } from "../controllers/main/user.controller";
const router = Router();

router.route("/signUp").post(registerUser)
router.route("/login").post(registerUser)

export default router;