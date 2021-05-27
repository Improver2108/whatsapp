import mongoose from 'mongoose';
const Schema=mongoose.Schema;
const userSchema=Schema({
    name:String,
    password:String,
    contacts:[{type:Schema.Types.ObjectId,ref:'Contact'}]
});
export default mongoose.model('User',userSchema);