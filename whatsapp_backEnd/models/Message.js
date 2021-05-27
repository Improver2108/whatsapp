import mongoose from 'mongoose';
const Schema=mongoose.Schema
const messageSchema=Schema({
    content:String,
    recieved:Boolean,
    timeStamp:{ type : Date, default: Date.now }
})
export default mongoose.model('Message',messageSchema);

