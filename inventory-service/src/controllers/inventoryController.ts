import logger from "../helper.ts/logger.js";
import {
  createItem,
  getItem,
  updateStock,
} from "../services/inventoryService.js";

export const createInventory = async (req, res) => {
  try {
    const createdItem = await createItem(req.body);
    if (createdItem) {
      res.status(201).json(createdItem);
    } else {
      res.status(400).json({ message: "Failed to create item" });
    }
  } catch (error) {
    logger.error(error);
  }
};

export const updateInventoryStock = async (req, res) => {
  try {
    const { itemId } = req.params;
    const { stockQuantity } = req.body;
    const updatedStock = await updateStock(itemId, stockQuantity);

    if (updatedStock) {
      res.status(201).json(updatedStock);
    } else {
      res.status(400).json({ message: "Failed to update item" });
    }
  } catch (error) {
    logger.error(error);
  }
};
export const getInventoryItem = async (req, res) => {
  try {
    const item = await getItem(req.params.itemId);
    res.json(item);
  } catch (error) {
    logger.error(error);
  }
};
