import { Item } from "../models/item.model";

export const createInventory = async (req, res) => {
  try {
    const item = new Item(req.body);
    await item.save();
    res.status(201).json(item);
  } catch (error) {
    console.log(error);
  }
};

export const updateInventoryStock = async (req, res) => {
  try {
    const { itemId } = req.params;
    const { stockQuantity } = req.body;
    const item = await Item.findByIdAndUpdate(
      itemId,
      { stockQuantity },
      { new: true }
    );

    // Publish stock update event
    // Example function (will implement in eventPublisher.ts)
    if (item) publishStockUpdateEvent(item);

    res.json(item);
  } catch (error) {
    console.log(error);
  }
};
export const getInventory = async (req, res) => {
  try {
    const item = await Item.findById(req.params.itemId);
    res.json(item);
  } catch (error) {
    console.log(error);
  }
};
