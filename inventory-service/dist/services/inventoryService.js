var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { Item } from "../models/itemModel.js";
export const createItem = (itemBody) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const item = new Item(itemBody);
        const savedItem = yield item.save();
        return savedItem;
    }
    catch (error) {
        console.log(error);
    }
});
export const getItem = (itemId) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const item = yield Item.findById(itemId);
        return item;
    }
    catch (error) {
        console.log(error);
    }
});
export function checkStock(itemId, quantity) {
    return __awaiter(this, void 0, void 0, function* () {
        // Simulate stock check logic (this could query a database)
        const item = yield Item.findById(itemId);
        return item ? item.stockQuantity >= quantity : false;
    });
}
export function updateStock(itemId, quantity) {
    return __awaiter(this, void 0, void 0, function* () {
        const item = yield Item.findById(itemId);
        if (!item) {
            throw new Error("Item not found");
        }
        if (quantity < 0) {
            throw new Error("Stock quantity cannot be negative");
        }
        item.stockQuantity = quantity;
        yield item.save();
        return item;
    });
}
export function deductStock(itemId, quantity) {
    return __awaiter(this, void 0, void 0, function* () {
        // Logic to update stock in your database
        try {
            const item = yield Item.findById(itemId);
            if (item) {
                yield Item.findByIdAndUpdate(itemId, { stockQuantity: (item === null || item === void 0 ? void 0 : item.stockQuantity) - quantity }, { new: true });
                console.log(`Updated stock for itemId: ${itemId} by reducing ${quantity}`);
                return true;
            }
        }
        catch (error) {
            return false;
            console.log(error);
        }
    });
}
