import mongoose from "mongoose";

export const PAYMENT_STATUS = /** @type {const} */ ({
  PENDING: "pending",
  PAID: "paid",
  FAILED: "failed",
  REFUNDED: "refunded",
});

const paymentSchema = new mongoose.Schema(
  {
    booking: { type: mongoose.Schema.Types.ObjectId, ref: "Booking", required: true, index: true },
    customer: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true, index: true },
    amount: { type: Number, required: true },
    currency: { type: String, default: "INR" },
    status: {
      type: String,
      enum: Object.values(PAYMENT_STATUS),
      default: PAYMENT_STATUS.PENDING,
      index: true,
    },
    provider: { type: String, default: "manual" }, // razorpay/stripe/manual
    transactionId: { type: String },
    meta: { type: Object, default: {} },
    paidAt: { type: Date },
  },
  { timestamps: true }
);

paymentSchema.index({ booking: 1, createdAt: -1 });

export const Payment = mongoose.model("Payment", paymentSchema);

