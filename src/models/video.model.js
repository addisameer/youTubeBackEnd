import mongoose from "mongoose";
import mongooseAggregatePaginate from "mongoose-aggregate-paginate-v2";
const videoSchema = new mongoose.Schema({
    videoFile : {
        type : string ,
        required  : true
    },
    thumbnail : {
        type : string ,
        required  : true
    },
    title : {
        type : string ,
        required  : true
    },
    description : {
        type : string 
    },
    duration : {
        type  : Number,
        required : true 
    },
    views : {
        type : Number,
        default  : 0
    },
    isPublished : {
        type  : Boolean,
        default : true
    },
    owner : {
        type : mongoose.Schema.Types.ObjectId,
        ref : "User"
    }
    
},{timestamps : true})

videoSchema.pluggin(mongooseAggregatePaginate)
export const Video = mongoose.model("Video" , videoSchema)