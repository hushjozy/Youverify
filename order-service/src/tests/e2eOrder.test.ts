import request from "supertest";
import amqp from "amqplib";
import { app } from "../app";
import { v4 as uuidv4 } from "uuid";

describe("E2E Test: Order and Inventory Services", () => {
  let channel;

  beforeAll(async () => {
    const connection = await amqp.connect("amqp://guest:guest@localhost:5672");
    channel = await connection.createChannel();
  });

  afterAll(async () => {
    await channel.close();
  });

  // Create order when available end test
  it("should place an order when stock is available", async () => {
    // Mock stock check response
    const itemId = "672de5efa3dccf3d22f21593";
    const quantity = 1;
    channel.sendToQueue(
      "inventory_queue",
      Buffer.from(JSON.stringify({ itemId, quantity })),
      {
        replyTo: "STOCK_UPDATED_QUEUE",
      }
    );

    const response = await request(app)
      .post("/api/orders/create")
      .send({ itemId, quantity });

    expect(response.status).toBe(201);
    expect(response.body.success).toBe(true);
    expect(response.body.createdOrder).toEqual(
      expect.objectContaining({
        itemId,
        quantity,
        status: "CREATED",
      })
    );
  });

  // Throw order error when insufficient end test
  it("should return an error for insufficient stock", async () => {
    const itemId = "672de5efa3dccf3d22f21593";
    const quantity = 5000;
    channel.sendToQueue(
      "inventory_queue",
      Buffer.from(JSON.stringify({ itemId, quantity })),
      {
        replyTo: "STOCK_UPDATED_QUEUE",
      }
    );
    const response = await request(app)
      .post("/api/orders/create")
      .send({ itemId, quantity });

    expect(response.status).toBe(400);
    expect(response.body.success).toBe(false);
    expect(response.body.status).toBe("Insufficient stock");
  });
});
