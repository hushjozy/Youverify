import express from "express";
import dotenv from "dotenv";
import mongoose from "mongoose";
import inventoryRouter from "./routes/inventoryRoute.js";
import { connectRabbitMQ } from "./events/publishEvent.js";
const app = express();
app.use(express.json());
dotenv.config();
const PORT = process.env.PORT || 4000;
const MONGO_URI = process.env.MONGO_URI || "";
app.use(express.json());
app.use("/api/inventory", inventoryRouter);
mongoose
    .connect(MONGO_URI)
    .then(() => {
    console.log("MongoDB connected");
    app.listen(PORT, () => {
        console.log(`Inventory Service running on http://localhost:${PORT}`);
    });
})
    .catch((err) => {
    console.error("Failed to connect to MongoDB", err);
});
connectRabbitMQ();
export { app };
