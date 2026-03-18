import mongoose from "mongoose";

export const TASK_STATUS = /** @type {const} */ ({
  ASSIGNED: "assigned",
  STARTED: "started",
  COMPLETED: "completed",
});

const photoSchema = new mongoose.Schema(
  {
    url: { type: String, required: true },
    publicId: { type: String },
    uploadedAt: { type: Date, default: Date.now },
  },
  { _id: false }
);

const workerTaskSchema = new mongoose.Schema(
  {
    booking: { type: mongoose.Schema.Types.ObjectId, ref: "Booking", required: true, index: true },
    worker: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true, index: true },
    status: { type: String, enum: Object.values(TASK_STATUS), default: TASK_STATUS.ASSIGNED },
    startedAt: { type: Date },
    completedAt: { type: Date },
    beforePhotos: [photoSchema],
    afterPhotos: [photoSchema],
  },
  { timestamps: true }
);

workerTaskSchema.index({ worker: 1, createdAt: -1 });

export const WorkerTask = mongoose.model("WorkerTask", workerTaskSchema);

