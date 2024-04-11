import mongoose from "mongoose";

const User = mongoose.model('user'); 

const workshopSchema = new mongoose.Schema({
    name: { type: String, required: true },
    description: { type: String, required: true },
    date: { type: Date, required: true, default: Date.now },
    professor: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
});

export default mongoose.model('Workshop', workshopSchema);
