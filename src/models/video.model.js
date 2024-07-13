import mongoose,{Schema} from "mongoose";//8.2

const videoSchema = new Schema(
    {
        videoFile:{
            type:String, //url
            required:true
        },
        thumbnail:{
            type:String, // url
            required:true
        },
        title:{
            type:String, 
            required:true
        },
        description:{
            type:String,
            required:true
        },
        duration:{
            type: Number, //url
            required:true
        },
        views:{
            type:Number,
            default:0,
        },
        idPublished:{
            type:Boolean,
            default:true
        },
        owner :[{
            type:Schema.Types.ObjectId,
            ref:"username"
        }]

    },
    {timestamps:true}
)

export const Video = mongoose.model("Video",videoSchema)