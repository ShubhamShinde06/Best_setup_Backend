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

export const generateAccessAndReFereshToken = async (userId) => {
    try {
       const user = await User.findById(userId)
       const accessToken = user.generateAccessToken()
       const refreshToken =  user.generateRefreshToken()

       user.refreshToken = refreshToken
       await user.save({ validateBeforSave: false })

       return {accessToken,refreshToken}

    } catch (error) {
        throw new ApiError(500,"Something went wrong while generating refresh and access token")
    }
}//16.2

export const registerUser = asyncHandler(async (req,res) => {

    // get user datails from frontend
    const {username,fullName,email,password} = req.body 
    //console.log("email",email);

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
    const existedUser = await User.findOne({
        $or: [{ username },{ email }]
    })
    if(existedUser){
        throw new ApiError(409, "User with email or username already exists")
    }

    // check for imgs , check avatar
    const avatarLocalPath = req.files?.avatar[0]?.path;
    //const coverImageLocalPath = req.files?.coverImage[0]?.path;

    let coverImageLocalPath;
    if(req.files && Array.isArray(req.files.coverImage) 
        && req.files.coverImage.length > 0){
            coverImageLocalPath = req.files.coverImage[0].path
    }

    if(!avatarLocalPath){
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

export const loginUser = asyncHandler(async (req, res) => {

    //req bosy -> data
    const {email, username, password} = req.body

    //username or email
    if(!username || !email){
        throw new ApiError(404,"username or email is required")
    }
    const user = await User.findOne({
        $or: [{username},{email}]
    })

    //find the user
    if(!user){
        throw new ApiError(400,"User does not exist")
    }
    
    //password check
    const isPasswordValid = await user.isPasswordCorrect(password)
    if(!isPasswordValid){
        throw new ApiError(401,"Invalid Passowrd")
    }

    //access and refresh token
    const {accessToken,refreshToken} = await 
    generateAccessAndReFereshToken(user._id)

    //not send this value
    const loggedInUser = User.findById(user._id)
    .select("-password -refreshToken")

    //send cookie other person modify on frontend but backend access only backend dev
    const option = {
        httpOnly: true,
        secure: true,
    }

    return res.status(200)
    .cookie("accessToken",accessToken, option)
    .cookie("refreshToken",refreshToken, option)
    .json(
        new ApiResponse(
            200,
            {
                user: loggedInUser, 
                      accessToken,
                      refreshToken
            },
            "User logged In Successfully"
        )
    )

})//16.1

export const logoutUser = asyncHandler(async(req,res) => {

    await User.findByIdAndUpdate(
        req.user._id,
        {
            $set:{refreshToken: undefined}
        },
        {
            new: true
        }
    )

    const option = {
        httpOnly: true,
        secure: true
    }

    return res
    .status(200)
    .clearCookie("accessToken",option)
    .clearCookie("refreshToken",option)
    .json(new ApiResponse(200,{},"User logged out"))

})//16.6