import mongoose from 'mongoose';
const Schema=mongoose.Schema;
const userSchema=Schema({
    name:String,
    password:String,
    email:String,
});
export default mongoose.model('User',userSchema);