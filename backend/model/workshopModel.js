import mongoose from "mongoose";


const workshopSchema = new mongoose.Schema({
    name: { type: String, required: true },
    description: { type: String, required: true },
    date: { type: Date, required: true, default: Date.now },
    professor: { type: String, required: true },
    
});


export default mongoose.model('workshop', workshopSchema);