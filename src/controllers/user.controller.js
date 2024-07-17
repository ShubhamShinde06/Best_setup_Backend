import {asyncHandler} from "../utils/asyncHandler.js";//12.1

export const registerUser = asyncHandler(async (req, res) => {
    res.status(200).json({
        message: "ok"
    })
})//12.2