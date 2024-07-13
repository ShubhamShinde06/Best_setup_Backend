import mongoose,{Schema} from "mongoose";//8.1

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
        fullname:{
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
)

export const User = mongoose.model("User",userSchema)