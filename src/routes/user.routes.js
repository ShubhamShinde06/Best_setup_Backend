import { Router } from "express";//13.1
import { registerUser } from "../controllers/user.controller.js";
import {upload} from "../middlewares/multer.middleware.js";//16.1

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

export default router;//13.3