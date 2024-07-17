import {asyncHandler} from "../utils/asyncHandler.js";//12.1
import {ApiError} from "../utils/ApiError.js";
import {User} from "../models/user.model.js";
import {uploadCloudinary} from "../utils/cloudnary.js";
import {ApiResponse} from "../utils/ApiRes.js";

/* 12.2 export const registerUser = asyncHandler(async (req, res) => {
    res.status(200).json({
       message: "ok"
    })
})*/

export const registerUser = asyncHandler(async (req,res) => {

    // get user datails from frontend
    const {username,fullName,email,password} = req.body 
    console.log("email",email);

    // validation - not empty
    // ex:- if(fullName === ""){
    //     throw new ApiError(404, "fullname is required")
    // }
    if(
        [fullName,email,username,password].some((field) => 
        field?.trim() === "")
    ) {
        throw new ApiError(400, "All fields are required")
    }

    // check if user already exists : username , email
    const existedUser = User.findOne({
        $or: [{ username },{ email }]
    })
    if(existedUser){
        throw new ApiError(409, "User with email or username already exists")
    }

    // check for imgs , check avatar
    const avatarLocalPath = req.files?.avatar[0]?.path;
    const coverImageLocalPath = req.files?.coverImage[0]?.path;

    if(avatarLocalPath){
        throw new ApiError(400, "Avatar file is required")
    }

    // upload them to cloudinary, avatar
    const avatar = await uploadCloudinary(avatarLocalPath);
    const coverImage = await uploadCloudinary(coverImageLocalPath);

    if(!avatar) {
        throw new ApiError(400, "Avatar file is required")
    }

    // create user object - cerate entry in db
    const user = await User.create(
        {
            fullName,
            avatar: avatar.url,
            coverImage: coverImage?.url || "",
            email,
            password,
            username: username.toLowerCase()
        }
    )

    // remove password and ref token field from res
    const createdUser = await User.findById(user._id).select(
        "-password -refreshToken"
    )

    // check for user creation 
    if(!createdUser){
        throw new ApiError(500, "Something went wrong while registering the user")
    }

    // return res
    return res.status(201).json(
        new ApiResponse(200, createdUser, "User Registered Successfully")
    )

})//15.1,12.2