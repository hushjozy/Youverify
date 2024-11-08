import express from "express";
import { createOrder, getOrder } from "../controllers/orderController.js";
const router = express.Router();
router.post("/create", createOrder);
router.get("/getOrders/:orderId", getOrder);
export default router;
