import amqp from "amqplib";
import { createOrderItem } from "../services/orderService.js";
import { v4 as uuidv4 } from "uuid";

let channel: amqp.Channel;

const MAX_RETRIES = 10;
const INITIAL_DELAY = 2000; // Initial delay of 2 seconds

export async function connectRabbitMQ() {
  const rabbitMQUri = process.env.RABBITMQ_URI || "";
  let attempts = 0;

  while (attempts < MAX_RETRIES) {
    try {
      console.log(
        `Connecting to RabbitMQ (Attempt ${attempts + 1}/${MAX_RETRIES})...`
      );
      const connection = await amqp.connect(rabbitMQUri);
      channel = await connection.createChannel();
      console.log("RabbitMQ connection established successfully.");
      return channel;
    } catch (error: any) {
      attempts += 1;
      const delay = INITIAL_DELAY * Math.pow(2, attempts); // Exponential backoff

      console.error(`Failed to connect to RabbitMQ: ${error.message}`);
      console.log(`Retrying in ${delay / 1000} seconds...`);

      // Wait for the delay before retrying
      await new Promise((resolve) => setTimeout(resolve, delay));
    }
  }

  throw new Error("Failed to connect to RabbitMQ after multiple attempts.");
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
