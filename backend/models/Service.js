import mongoose from "mongoose";

const serviceSchema = new mongoose.Schema(
  {
    _id: { type: String },

    name: { type: String, required: true },
    description: { type: String, default: "" },
    serviceKey: { type: String, default: "" },

    price: { type: Number, required: true },

    image: { type: String, required: true },
    category: { type: String, default: "General" },

    rating: { type: Number, default: 4 },
    reviews: { type: Number, default: 4 },



    isActive: { type: Boolean, default: true }
  },
  { timestamps: true }
);
export const Service = mongoose.models.Service || mongoose.model("Service", serviceSchema);
