var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { createItem, getItem, updateStock, } from "../services/inventoryService.js";
export const createInventory = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const createdItem = yield createItem(req.body);
        if (createdItem) {
            res.status(201).json(createdItem);
        }
        else {
            res.status(400).json({ message: "Failed to create item" });
        }
    }
    catch (error) {
        console.log(error);
    }
});
export const updateInventoryStock = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { itemId } = req.params;
        const { stockQuantity } = req.body;
        const updatedStock = yield updateStock(itemId, stockQuantity);
        if (updatedStock) {
            res.status(201).json(updatedStock);
        }
        else {
            res.status(400).json({ message: "Failed to update item" });
        }
    }
    catch (error) {
        console.log(error);
    }
});
export const getInventoryItem = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const item = yield getItem(req.params.itemId);
        res.json(item);
    }
    catch (error) {
        console.log(error);
    }
});
