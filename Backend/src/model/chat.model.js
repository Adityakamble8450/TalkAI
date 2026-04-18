import mongoose from "mongoose";

const chatShema = new mongoose.Schema({
    user : {
        type : mongoose.Schema.Types.ObjectId ,
        ref : "User" ,
        required: true
    } , 
    title : {
        type : String ,
        default : "new chat",
        trime : true
    }
}, {timestamps:true})

const chatModel = mongoose.model('chat' , chatShema )

export default chatModel