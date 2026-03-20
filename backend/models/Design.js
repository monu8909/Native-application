import mongoose from "mongoose";

const designSchema = new mongoose.Schema(
  {
    title: { type: String, default: "" },
    description: { type: String, default: "" },
    imageUrl: { type: String, required: true },
    uploadedBy: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true }, // admin reference
  },
  { timestamps: true }
);

export const Design = mongoose.models.Design || mongoose.model("Design", designSchema);
