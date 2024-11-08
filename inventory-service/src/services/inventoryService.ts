import logger from "../helper.ts/logger.js";
import { Item } from "../models/itemModel.js";

export const createItem = async (itemBody) => {
  try {
    const item = new Item(itemBody);
    const savedItem = await item.save();
    return savedItem;
  } catch (error) {
    logger.error(error);
  }
};
export const getItem = async (itemId) => {
  try {
    const item = await Item.findById(itemId);
    return item;
  } catch (error) {
    logger.error(error);
  }
};
export async function checkStock(itemId, quantity: number): Promise<boolean> {
  // Simulate stock check logic (this could query a database)
  const item = await Item.findById(itemId);
  return item ? item.stockQuantity >= quantity : false;
}

export async function updateStock(itemId, quantity: number) {
  const item = await Item.findById(itemId);

  if (!item) {
    logger.error("Item not found");
    throw new Error("Item not found");
  }

  if (quantity < 0) {
    logger.error("Stock quantity cannot be negative");
    throw new Error("Stock quantity cannot be negative");
  }

  item.stockQuantity = quantity;
  await item.save();
  return item;
}

export async function deductStock(itemId, quantity: number) {
  // Logic to update stock in your database
  try {
    const item = await Item.findById(itemId);
    if (item) {
      await Item.findByIdAndUpdate(
        itemId,
        { stockQuantity: item?.stockQuantity - quantity },
        { new: true }
      );

      logger.info(
        `Updated stock for itemId: ${itemId} by reducing ${quantity}`
      );
      return true;
    }
  } catch (error) {
    logger.error(error);
    return false;
  }
}
