import mongoose from "mongoose";

const applicationSchema = new mongoose.Schema({
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true},
    workshop: {  type: mongoose.Schema.Types.ObjectId, ref: 'Workshop', required: true},
    registrationDate: { type: Date, required: true, default: Date.now},
    status: { type: String, required: true, default: 'Pending...' },
    points: { type: String, required: true, default: 0 },
    evaluation: { type: String, required: true, default: 'not evaluated' },
    remark: { type: String, required: true, default: 'no remark' },
});

export default mongoose.model('application', applicationSchema);
