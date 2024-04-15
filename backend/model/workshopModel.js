import mongoose from "mongoose";

const User = mongoose.model('user'); 

const workshopSchema = new mongoose.Schema({
    name: { type: String, required: true },
    description: { type: String, required: true },
    StartDate: { type: Date, required: true, default: Date.now },
    EndDate: { type: Date, required: true, default: Date.now },
    professor: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    Visibility:{type:Boolean, default:false}
});

export default mongoose.model('Workshop', workshopSchema);
