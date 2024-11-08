var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import amqp from "amqplib";
import { createOrderItem } from "../services/orderService.js";
import { v4 as uuidv4 } from "uuid";
let channel;
export function connectRabbitMQ() {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const connection = yield amqp.connect("amqp://localhost:5672");
            channel = yield connection.createChannel();
            console.log("RabbitMQ connection established successfully.");
        }
        catch (error) {
            console.error("Failed to connect to RabbitMQ:", error);
        }
    });
}
const INVENTORY_QUEUE = "inventory_queue";
const STOCK_UPDATED_QUEUE = "STOCK_UPDATED_QUEUE";
export function startCheckOrder(itemId, quantity, res) {
    return __awaiter(this, void 0, void 0, function* () {
        const correlationId = uuidv4();
        yield channel.assertQueue(INVENTORY_QUEUE, { durable: true });
        yield channel.assertQueue(STOCK_UPDATED_QUEUE, { durable: true });
        console.log("Order Service is ready to create orders...");
        const order = {
            itemId: itemId, // Item ID
            quantity: quantity, // Quantity ordered
        };
        console.log(`Sending stock check request for itemId: ${order.itemId} with quantity: ${order.quantity}`);
        // Send the order to the Inventory Service to check stock
        channel.sendToQueue(INVENTORY_QUEUE, Buffer.from(JSON.stringify(order)), {
            persistent: true,
            correlationId,
            replyTo: STOCK_UPDATED_QUEUE,
        });
        // Listen for the stock update confirmation or error
        console.log("Listening for stock updates on STOCK_UPDATED_QUEUE on order...");
        channel.consume(STOCK_UPDATED_QUEUE, (msg) => __awaiter(this, void 0, void 0, function* () {
            if (msg && msg.properties.correlationId === correlationId) {
                const response = JSON.parse(msg.content.toString());
                console.log(`feedback: ${response}`);
                const { itemId, quantity, status } = response;
                if (status === "success") {
                    const createdOrder = yield createOrderItem({
                        itemId,
                        quantity,
                        status: "CREATED",
                    });
                    if (createdOrder) {
                        res
                            .status(201)
                            .json({ success: true, createdOrder, status: "CREATED" });
                    }
                }
                else if (status === "insufficient stock") {
                    res.status(400).json({
                        success: false,
                        status: `Insufficient stock`,
                    });
                    console.log(`Error: Insufficient stock for itemId: ${itemId}`);
                }
                channel.ack(msg);
            }
        }), { noAck: false });
    });
}
// export { listenToStockUpdates };
