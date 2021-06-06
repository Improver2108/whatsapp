import mongoose from 'mongoose';
const Schema=mongoose.Schema;
const messageSchema=Schema({
    content:String,
    timeStamp:{type:Date,default:Date.now},
    recieved:Boolean
})
export default mongoose.model('Message',messageSchema);