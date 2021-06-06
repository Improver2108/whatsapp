import mongoose from 'mongoose';
const Schema=mongoose.Schema
const contactSchema=Schema({
    messages:[{type:Schema.Types.ObjectId,ref:'Message'}],
    sender_id:{type:Schema.Types.ObjectId,ref:'User'},
    reciever_id:{type:Schema.Types.ObjectId,ref:'User'},
    reciever_name:"String"
})
export default mongoose.model('Contact',contactSchema);

