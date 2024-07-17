import { Router } from "express";//13.1
import { registerUser } from "../controllers/user.controller.js";

const router = Router()//13.2

router.route("/register").post(registerUser)//14.3

export default router;//13.3