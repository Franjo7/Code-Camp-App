import mongoose from "mongoose";


const userSchema = new mongoose.Schema({
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    tel: { type: String, required: true },
    email: { type: String, required: true },
    password: { type: String, required: true },
    role: { type: [String] , default: ['user']},
},{ timestamps: true });


export default mongoose.model('user', userSchema);