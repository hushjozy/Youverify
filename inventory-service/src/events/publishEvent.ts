import amqp from "amqplib";
import { checkStock, deductStock } from "../services/inventoryService.js";
import logger from "../helper.ts/logger.js";

let channel: amqp.Channel;

export async function connectRabbitMQ() {
  try {
    const connection = await amqp.connect(process.env.RABBITMQ_URI || "");
    channel = await connection.createChannel();
    logger.info("RabbitMQ connection established successfully.");
    start().catch(console.error);
  } catch (error) {
    console.log(process.env.RABBITMQ_URI, error);

    logger.error("Failed to connect to RabbitMQ:", error);
  }
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
