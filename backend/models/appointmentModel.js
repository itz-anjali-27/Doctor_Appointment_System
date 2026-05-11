import mongoose from "mongoose";

const appointmentSchema = new mongoose.Schema({
    userId: {
        type: String,
        required: true
    },
    docId: {
        type: String,
        required: true
    },
    slotDate: {
        type: String,
        required: true
    },
    slotTime: {
        type: String,
        required: true
    },
    userData: {
        type: Object,
        required: true,
        default: {} 
    },
    docData: {
        type: Object,
        required: true,
        default: {} 
    },
    amount: {
        type: Number,
        required: true,
        default: 0
    },
    date: {
        type: Number,
        required: true,
        default: Date.now()
    },
    cancelled: {
        type: Boolean,
        default: false
    },
    payment: {
        type: Boolean,
        default: false
    },
    isCompleted: {
        type: Boolean,
        default: false
    }
});

const appointmentModel = mongoose.models.appointment || mongoose.model('appointment', appointmentSchema);
export default appointmentModel;