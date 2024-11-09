import amqp from "amqplib";
import { checkStock, deductStock } from "../services/inventoryService.js";
import logger from "../helper.ts/logger.js";

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
      start().catch(console.error);
      logger.info("RabbitMQ connection established successfully.");
      return channel;
    } catch (error: any) {
      attempts += 1;
      const delay = INITIAL_DELAY * Math.pow(2, attempts); // Exponential backoff

      console.error(`Failed to connect to RabbitMQ: ${error?.message}`);
      console.log(`Retrying in ${delay / 1000} seconds...`);

      // Wait for the delay before retrying
      await new Promise((resolve) => setTimeout(resolve, delay));
    }
  }

  throw new Error("Failed to connect to RabbitMQ after multiple attempts.");
}
const INVENTORY_QUEUE = "inventory_queue";
const STOCK_UPDATED_QUEUE = "STOCK_UPDATED_QUEUE";

async function start() {
  await channel.assertQueue(INVENTORY_QUEUE, { durable: true });

  console.log("Inventory Service is waiting for stock check requests...");

  channel.consume(
    INVENTORY_QUEUE,
    async (msg) => {
      if (msg) {
        const order = JSON.parse(msg.content.toString());
        const { itemId, quantity } = order;
        logger.info(
          `Received stock check for itemId: ${itemId} with quantity: ${quantity}`
        );

        // Check stock availability
        const stockAvailable = await checkStock(itemId, quantity);
        const replyTo = msg.properties.replyTo;
        const correlationId = msg.properties.correlationId;
        if (stockAvailable) {
          // Deduct stock and publish event
          logger.info(
            `Stock available for itemId: ${itemId}, deducting ${quantity}`
          );
          const updatedStock = await deductStock(itemId, quantity);

          // Publish stock update event to another queue
          if (updatedStock) {
            logger.info(`Stock updated for itemId: ${itemId},`);
            // Send the response back to the reply queue

            channel.sendToQueue(
              replyTo,
              Buffer.from(
                JSON.stringify({
                  itemId,
                  quantity,
                  success: true,
                  status: "success",
                })
              ),
              {
                correlationId,
              }
            );
          }
        } else {
          // Publish error message if stock is insufficient
          logger.error(`Insufficient stock for itemId: ${itemId}`);
          channel.sendToQueue(
            replyTo,
            Buffer.from(
              JSON.stringify({
                itemId,
                success: false,
                quantity,
                status: "insufficient stock",
              })
            ),
            {
              correlationId,
            }
          );
        }
        channel.ack(msg); // Acknowledge the message
      }
    },
    { noAck: false }
  );
}
