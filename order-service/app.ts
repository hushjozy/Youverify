import express from "express";
import dotenv from "dotenv";
import mongoose from "mongoose";
import itemRoutes from "./src/routes/inventory.route";

const app = express();
app.use(express.json());
app.use(itemRoutes);

mongoose
  .connect(process.env.MONGO_URI ?? "", {
    // useNewUrlParser: true,
    // useUnifiedTopology: true,
  })
  .then(() => console.log("Connected to MongoDB"));

export default app;
