import mongoose,{Schema} from "mongoose";//8.2
import mongooseAggregatePaginate from "mongoose-aggregate-paginate-v2";//8.3

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
)//8.2

videoSchema.plugin(mongooseAggregatePaginate)//8.4

export const Video = mongoose.model("Video",videoSchema)//8.2