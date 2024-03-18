import mongoose from "mongoose";


const userSchema = new mongoose.Schema({
    first_name: { type: String, required: true },
    last_name: { type: String, required: true },
    telephone: { type: String, required: true },
    email: { type: String, required: true },
    password: { type: String, required: true },
    role: { type: [String] , default: ['user']},
},{ timestamps: true });


export default mongoose.model('user', userSchema);