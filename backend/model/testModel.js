import mongoose from "mongoose";

const testSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    workshopId: { type: mongoose.Schema.Types.ObjectId, ref: 'Workshop', required: true },
    date: { type: Date, required: true, default: Date.now },
    file:{
        data:{type:Buffer, required:true},
        contentType:{type:String, required:true},
        filename:{type:String, required:true}
    }
});

export default mongoose.model('test', testSchema);