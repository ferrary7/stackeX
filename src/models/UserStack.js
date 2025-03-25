import mongoose from "mongoose";

const UserStackSchema = new mongoose.Schema({
  userId: { type: String, required: true },
  stacks: { type: [String], required: true },
  createdAt: { type: Date, default: Date.now },
});

export default mongoose.models.UserStack || mongoose.model("UserStack", UserStackSchema);
