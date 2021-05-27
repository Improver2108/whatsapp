import mongoose from 'mongoose';
const Schema=mongoose.Schema
const contactSchema=Schema({
    name:String,
    messages:[{type:Schema.Types.ObjectId,ref:'Message'}]
})
export default mongoose.model('Contact',contactSchema);