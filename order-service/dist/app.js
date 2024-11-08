import express from "express";
import dotenv from "dotenv";
import mongoose from "mongoose";
import orderRouter from "./routes/orderRoute.js";
import { connectRabbitMQ } from "./events/listener.event.js";
dotenv.config();
const PORT = process.env.PORT || 4000;
const MONGO_URI = process.env.MONGO_URI || "";
const app = express();
app.use(express.json());
app.use("/api/orders", orderRouter);
mongoose
    .connect(MONGO_URI)
    .then(() => {
    console.log("MongoDB connected");
    app.listen(PORT, () => {
        console.log(`Order Service running on http://localhost:${PORT}`);
    });
})
    .catch((err) => {
    console.error("Failed to connect to MongoDB", err);
});
connectRabbitMQ();
export { app };
