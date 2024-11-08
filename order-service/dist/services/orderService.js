var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { Order } from "../models/orderModel.js";
export const checkStock = (quantity, stockQuantity) => {
    try {
        return quantity <= stockQuantity;
    }
    catch (error) {
        console.log(error);
    }
};
export const createOrderItem = (itemBody) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const order = new Order(itemBody);
        yield order.save();
        return order;
    }
    catch (error) {
        console.log(error);
    }
});
export const getOrder = (orderId) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const order = yield Order.findById(orderId);
        return order;
    }
    catch (error) {
        console.log(error);
    }
});
