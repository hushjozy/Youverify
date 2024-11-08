import { Order } from "../models/orderModel.js";

export const checkStock = (quantity, stockQuantity) => {
  try {
    return quantity <= stockQuantity;
  } catch (error) {
    console.log(error);
  }
};
export const createOrderItem = async (itemBody) => {
  try {
    const order = new Order(itemBody);
    await order.save();
    return order;
  } catch (error) {
    console.log(error);
  }
};
export const getOrder = async (orderId) => {
  try {
    const order = await Order.findById(orderId);
    return order;
  } catch (error) {
    console.log(error);
  }
};
