import mongoose from "mongoose";

const attendanceSchema = new mongoose.Schema(
  {
    worker: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true, index: true },
    date: { type: Date, required: true, index: true },
    status: { type: String, enum: ["present", "leave"], required: true },
    markedBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    note: { type: String, trim: true },
  },
  { timestamps: true }
);

// Prevent duplicate attendance for the same worker on the same day (normalized to midnight)
attendanceSchema.index({ worker: 1, date: 1 }, { unique: true });

export const Attendance = mongoose.model("Attendance", attendanceSchema);
