import mongoose from "mongoose";

const registrationSchema = new mongoose.Schema({
    user: { type: String, required: true},
    workshop: { type: String, required: true},
    registrationDate: { type: Date, required: true, default: Date.now},
    status: { type: String, required: true, default: 'pending' },
    points: { type: Number, required: true, default: 0 },
    evaluation: { type: String, required: true, default: 'not evaluated' },
    remark: { type: String, required: true, default: 'no remark' },
});

export default mongoose.model('registration', registrationSchema);
