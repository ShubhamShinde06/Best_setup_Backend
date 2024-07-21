import { Router } from "express";//13.1
import { loginUser, logoutUser, registerUser } from "../controllers/user.controller.js";
import {upload} from "../middlewares/multer.middleware.js";//16.1
import {verifyJWT} from "../middlewares/auth.middle.js"

const router = Router()//13.2

router.route("/register").post(
    upload.fields([
        {
            name:"avatar",
            maxCount: 1
        },
        {
            name:"coverImage",
            maxCount: 1
        }
    ]), //16.2
    registerUser//14.3
)

router.route("/login").post(loginUser) //16.4

//secured routes
router.route("/logout").post(verifyJWT, logoutUser) //16.5


export default router;//13.3