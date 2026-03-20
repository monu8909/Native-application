import mongoose from "mongoose";

const workerPaymentRecordSchema = new mongoose.Schema(
  {
    worker: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true, index: true },
    amount: { type: Number, required: true, min: 0 },
    paymentDate: { type: Date, default: Date.now },
    method: { type: String, enum: ["cash", "online", "bank_transfer"], default: "cash" },
    notes: { type: String, trim: true },
    admin: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  },
  { timestamps: true }
);

export const WorkerPaymentRecord = mongoose.model("WorkerPaymentRecord", workerPaymentRecordSchema);
