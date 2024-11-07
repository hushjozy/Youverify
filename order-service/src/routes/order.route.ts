import express from "express";
import { createOrder, getOrder } from "../controllers/order.controller";

const router = express.Router();

router.post("/orders", createOrder);
router.get("/orders/:orderId", getOrder);

export default router;
