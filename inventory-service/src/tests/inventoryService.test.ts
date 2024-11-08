import { Item } from "../models/itemModel";
import { checkStock, getItem, updateStock } from "../services/inventoryService";
import mongoose from "mongoose";
import { MongoMemoryServer } from "mongodb-memory-server";
import dotenv from "dotenv";
dotenv.config();

let mongoServer;

// Mock connect
beforeAll(async () => {
  try {
    mongoServer = await MongoMemoryServer.create();
    const uri = mongoServer.getUri();

    await mongoose.connect(uri, {
      // useNewUrlParser: true,
      // useUnifiedTopology: true,
    });

    console.log(`Successfully connected to in-memory MongoDB at ${uri}`);
  } catch (error) {
    console.log(`MongoDB connection error: ${error}`);
    throw new Error("Failed to connect to MongoDB");
  }
});

afterAll(async () => {
  await mongoose.disconnect();
  await mongoServer.stop();
});
beforeEach(async () => {
  await Item.deleteMany({});
});

// Update item test
describe("updateStock", () => {
  it("should update stock with valid quantity", async () => {
    const item = await Item.create({
      name: "Sample Item",
      description: "A space filler",
      stockQuantity: 20,
      price: 100,
    });
    const result = await updateStock(item._id, 30);
    if (result) {
      expect(result.stockQuantity).toEqual(30);
    }
  });

  it("should throw an error for negative quantity", async () => {
    const item = await Item.create({
      name: "Sample Item",
      description: "A space filler",
      stockQuantity: 20,
      price: 100,
    });
    await expect(updateStock(item._id, -5)).rejects.toThrow(
      "Stock quantity cannot be negative"
    );
  });
});
// check stock item test

describe("checkStock", () => {
  it("should return true if stock is upto quantity", async () => {
    const item = await Item.create({
      name: "Sample Item",
      description: "A space filler",
      stockQuantity: 10,
      price: 100,
    });

    const result = await checkStock(item._id, 10);
    expect(result).toBe(true);
  });
  it("should return false if stock is not upto quantity", async () => {
    const item = await Item.create({
      name: "Sample Item",
      description: "A space filler",
      stockQuantity: 10,
      price: 100,
    });
    const result = await checkStock(item._id, 20);
    expect(result).toBe(false);
  });
});

// get item test

describe("getItem", () => {
  it("should fetch inventory item with stock quantiy and description", async () => {
    const item = await Item.create({
      name: "Sample Item",
      description: "A space filler",
      stockQuantity: 40,
      price: 100,
    });
    const result = await getItem(item._id);
    expect(result).toEqual(
      expect.objectContaining({
        description: "A space filler",
        name: "Sample Item",
        price: 100,
        stockQuantity: 40,
      })
    );
  });
});
