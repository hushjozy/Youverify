import mongoose from "mongoose";
const orderSchema = new mongoose.Schema({
    itemId: { type: mongoose.Schema.Types.ObjectId, required: true },
    quantity: { type: Number, required: true },
    status: { type: String, enum: ["CREATED", "FAILED"], default: "CREATED" },
});
export const Order = mongoose.model("Order", orderSchema);
