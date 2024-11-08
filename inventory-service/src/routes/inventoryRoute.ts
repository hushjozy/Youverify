import express from "express";
import {
  createInventory,
  getInventoryItem,
  updateInventoryStock,
} from "../controllers/inventoryController.js";

const router = express.Router();

router.post("/items", createInventory);

router.patch("/items/:itemId/stock", updateInventoryStock);

router.get("/items/:itemId", getInventoryItem);

export default router;
