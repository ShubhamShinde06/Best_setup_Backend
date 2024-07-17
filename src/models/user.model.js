import mongoose,{Schema} from "mongoose";//8.1
import jwt from "jsonwebtoken";//9.1
import bcrypt from "bcrypt";//9.2

const userSchema = new Schema(
    {
        username:{
            type:String,
            required: true,
            unique: true,
            lowecase: true,
            trim: true,
            index: true
        },
        email:{
            type:String,
            required: true,
            unique: true,
            lowecase: true,
            trim: true,
        },
        fullName:{
            type:String,
            required: true,
            trim: true,
            index: true
        },
        avatar:{
            type: String, //cloudinary url
            required: true,
        },
        coverImage:{
            type: String //cloudinary url
        },
        watchHistroy:[
            {
                type:Schema.Types.ObjectId,
                ref: "video"
            }
        ],
        password:{
            type: String,
            required:[true,'Passowrd is Required']
        },
        refreshToken:{
            type: String
        }
    },
    {timestamps:true}
)//8.1

userSchema.pre("save", async function (next){
    if(!this.isModified("password")) return next();

    this.password = await bcrypt.hash(this.password, 10)
    next()
})//9.3

userSchema.methods.isPasswordCorrect = async function
(password){
   return await bcrypt.compare(password,this.password)
}//9.4

userSchema.method.generateAccessToken = function(){
    return  jwt.sign(
        {
            _id: this._id,
            email: this.email,
            username: this.username,
            fullName: this.fullName,
        },
        process.env.ACCESS_TOKEN_SECRET,
        {
            expiresIn: process.env.ACCESS_TOKEN_EXPIRY
        }
    )
}//9.5

userSchema.method.generateRefreshToken = function(){
    return  jwt.sign(
        {
            _id: this._id,
        },
        process.env.REFRESH_TOKEN_SECRET,
        {
            expiresIn: process.env.REFRESH_TOKEN_EXPIRY
        }
    )
}//9.6

export const User = mongoose.model("User",userSchema)