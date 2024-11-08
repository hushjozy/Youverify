import { startCheckOrder } from "../events/listener.event.js";
import { Order } from "../models/orderModel.js";

export const createOrder = async (req, res) => {
  try {
    const { itemId, quantity } = req.body;
    await startCheckOrder(itemId, quantity, res);
  } catch (error) {
    console.log(error);
  }
};

export const getOrder = async (req, res) => {
  try {
    const order = await Order.findById(req.params.orderId);
    res.json(order);
  } catch (error) {
    console.log(error);
  }
};
