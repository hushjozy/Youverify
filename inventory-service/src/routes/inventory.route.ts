import express from "express";
import {
  createInventory,
  getInventory,
  updateInventoryStock,
} from "../controllers/inventory.controller.js";

const router = express.Router();

router.post("/items", createInventory);

router.patch("/items/:itemId/stock", updateInventoryStock);

router.get("/items/:itemId", getInventory);

export default router;
