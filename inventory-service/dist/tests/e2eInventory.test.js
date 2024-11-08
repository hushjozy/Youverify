var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import request from "supertest";
import amqp from "amqplib";
import app from "../server.js"; // Your Express app
describe("E2E Test: Order and Inventory Services", () => {
    let channel;
    beforeAll(() => __awaiter(void 0, void 0, void 0, function* () {
        const connection = yield amqp.connect("amqp://localhost:5672");
        channel = yield connection.createChannel();
    }));
    afterAll(() => __awaiter(void 0, void 0, void 0, function* () {
        yield channel.close();
    }));
    it("should place an order when stock is available", () => __awaiter(void 0, void 0, void 0, function* () {
        // Mock stock check response
        const itemId = "672de5efa3dccf3d22f21593";
        const quantity = 1;
        channel.sendToQueue("inventory_queue", Buffer.from(JSON.stringify({ itemId, quantity })), {
            replyTo: "STOCK_UPDATED_QUEUE",
        });
        const response = yield request(app)
            .post("/api/orders")
            .send({ itemId, quantity });
        expect(response.status).toBe(201);
        expect(response.body.success).toBe(true);
        expect(response.body.createdOrder).toEqual({
            itemId,
            quantity,
            status: "CREATED",
        });
    }));
    it("should return an error for insufficient stock", () => __awaiter(void 0, void 0, void 0, function* () {
        const itemId = "item123";
        const quantity = 50;
        const response = yield request(app)
            .post("/api/orders")
            .send({ itemId, quantity });
        expect(response.status).toBe(400);
        expect(response.body.success).toBe(false);
        expect(response.body.message).toBe("Insufficient stock for item123");
    }));
});
