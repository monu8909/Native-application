import mongoose from "mongoose";
const WorkersSchema = new mongoose.Schema({
    _id: { type: String, trim: true, maxlength: 120 },
    firstName: { type: String, trim: true, maxlength: 120 },
    lastName: { type: String, trim: true, maxlength: 120 },
    maidenName: { type: String, trim: true, maxlength: 120 },
    age: { type: Number, trim: true, maxlength: 120 },
    gender: { type: String, trim: true, maxlength: 120 },
    email: { type: String, trim: true, maxlength: 120 },
    phone: { type: String, trim: true, maxlength: 120 },
    username: { type: String, trim: true, maxlength: 120 },
    passwordHash: { type: String, trim: true, maxlength: 120 },
    birthDate: { type: String, trim: true, maxlength: 120 },
    image: { type: String, trim: true, maxlength: 120 },
    address: { type: mongoose.Schema.Types.Mixed },
    isActive: { type: Boolean, default: true, index: true },
    role: { type: String, trim: true, maxlength: 120 },
    fcmTokens: [{ type: String }],
    refreshTokens: [{ type: String }],
    wallet: { type: String, trim: true, maxlength: 120 },
    dailyWage: { type: Number, trim: true, maxlength: 120 },
    salaryType: { type: String, trim: true, maxlength: 120 },
    lastKnownLocation: { type: String, trim: true, maxlength: 120 },
    lastKnownLocationUpdatedAt: { type: String, trim: true, maxlength: 120 },


})
export const Workers = mongoose.model("workers", WorkersSchema);
