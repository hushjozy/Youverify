var __awaiter =
  (this && this.__awaiter) ||
  function (thisArg, _arguments, P, generator) {
    function adopt(value) {
      return value instanceof P
        ? value
        : new P(function (resolve) {
            resolve(value);
          });
    }
    return new (P || (P = Promise))(function (resolve, reject) {
      function fulfilled(value) {
        try {
          step(generator.next(value));
        } catch (e) {
          reject(e);
        }
      }
      function rejected(value) {
        try {
          step(generator["throw"](value));
        } catch (e) {
          reject(e);
        }
      }
      function step(result) {
        result.done
          ? resolve(result.value)
          : adopt(result.value).then(fulfilled, rejected);
      }
      step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
  };
import amqp from "amqplib";
import { checkStock, deductStock } from "../services/inventoryService.js";
let channel;
export function connectRabbitMQ() {
  return __awaiter(this, void 0, void 0, function* () {
    try {
      const connection = yield amqp.connect("amqp://rabbitmq:5672");
      channel = yield connection.createChannel();
      console.log("RabbitMQ connection established successfully.");
      start().catch(console.error);
    } catch (error) {
      console.error("Failed to connect to RabbitMQ:", error);
    }
  });
}
const INVENTORY_QUEUE = "inventory_queue";
const STOCK_UPDATED_QUEUE = "STOCK_UPDATED_QUEUE";
function start() {
  return __awaiter(this, void 0, void 0, function* () {
    yield channel.assertQueue(INVENTORY_QUEUE, { durable: true });
    console.log("Inventory Service is waiting for stock check requests...");
    channel.consume(
      INVENTORY_QUEUE,
      (msg) =>
        __awaiter(this, void 0, void 0, function* () {
          if (msg) {
            const order = JSON.parse(msg.content.toString());
            const { itemId, quantity } = order;
            console.log(
              `Received stock check for itemId: ${itemId} with quantity: ${quantity}`
            );
            // Check stock availability
            const stockAvailable = yield checkStock(itemId, quantity);
            const replyTo = msg.properties.replyTo;
            const correlationId = msg.properties.correlationId;
            if (stockAvailable) {
              // Deduct stock and publish event
              console.log(
                `Stock available for itemId: ${itemId}, deducting ${quantity}`
              );
              const updatedStock = yield deductStock(itemId, quantity);
              // Publish stock update event to another queue
              if (updatedStock) {
                console.log(`Stock updated for itemId: ${itemId},`);
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
              console.log(`Insufficient stock for itemId: ${itemId}`);
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
        }),
      { noAck: false }
    );
  });
}
