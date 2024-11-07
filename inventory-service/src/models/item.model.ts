import mongoose from "mongoose";

const itemSchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: String,
  stockQuantity: { type: Number, required: true },
});

export const Item = mongoose.model("Item", itemSchema);
