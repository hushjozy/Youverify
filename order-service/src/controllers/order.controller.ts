import { Order } from "../models/order.model";

export const createOrder = async (req, res) => {
  try {
    const { itemId, quantity } = req.body;

    // Check stock, create order, etc.
    const order = new Order({ itemId, quantity });
    await order.save();
    res.status(201).json(order);
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
