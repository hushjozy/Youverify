import amqp from "amqplib";
import { createOrderItem } from "../services/orderService.js";
import { v4 as uuidv4 } from "uuid";

let channel: amqp.Channel;

export async function connectRabbitMQ() {
  try {
    const connection = await amqp.connect(process.env.RABBITMQ_URI || "");
    channel = await connection.createChannel();
    console.log("RabbitMQ connection established successfully.");
  } catch (error) {
    console.log(process.env.RABBITMQ_URI, error);

    // console.error("Failed to connect to RabbitMQ:", error);
  }
}

const INVENTORY_QUEUE = "inventory_queue";
const STOCK_UPDATED_QUEUE = "STOCK_UPDATED_QUEUE";

export async function startCheckOrder(itemId: string, quantity: number, res) {
  const correlationId = uuidv4();
  await channel.assertQueue(INVENTORY_QUEUE, { durable: true });
  await channel.assertQueue(STOCK_UPDATED_QUEUE, { durable: true });

  console.log("Order Service is ready to create orders...");
  const order = {
    itemId: itemId, // Item ID
    quantity: quantity, // Quantity ordered
  };

  console.log(
    `Sending stock check request for itemId: ${order.itemId} with quantity: ${order.quantity}`
  );

  // Send the order to the Inventory Service to check stock
  channel.sendToQueue(INVENTORY_QUEUE, Buffer.from(JSON.stringify(order)), {
    persistent: true,
    correlationId,
    replyTo: STOCK_UPDATED_QUEUE,
  });

  // Listen for the stock update confirmation or error
  console.log("Listening for stock updates on STOCK_UPDATED_QUEUE on order...");
  channel.consume(
    STOCK_UPDATED_QUEUE,
    async (msg) => {
      if (msg && msg.properties.correlationId === correlationId) {
        const response = JSON.parse(msg.content.toString());
        console.log(`feedback: ${response}`);

        const { itemId, quantity, status } = response;

        if (status === "success") {
          const createdOrder = await createOrderItem({
            itemId,
            quantity,
            status: "CREATED",
          });
          if (createdOrder) {
            res
              .status(201)
              .json({ success: true, createdOrder, status: "CREATED" });
          }
        } else if (status === "insufficient stock") {
          res.status(400).json({
            success: false,
            status: `Insufficient stock`,
          });
          console.log(`Error: Insufficient stock for itemId: ${itemId}`);
        }
        channel.ack(msg);
      }
    },
    { noAck: false }
  );
}
// export { listenToStockUpdates };
