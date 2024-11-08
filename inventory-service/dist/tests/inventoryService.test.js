var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { Item } from "../models/itemModel";
import { checkStock, getItem, updateStock } from "../services/inventoryService";
import mongoose from "mongoose";
import { MongoMemoryServer } from "mongodb-memory-server";
import dotenv from "dotenv";
dotenv.config();
let mongoServer;
beforeAll(() => __awaiter(void 0, void 0, void 0, function* () {
    try {
        mongoServer = yield MongoMemoryServer.create();
        const uri = mongoServer.getUri();
        yield mongoose.connect(uri, {
        // useNewUrlParser: true,
        // useUnifiedTopology: true,
        });
        console.log(`Successfully connected to in-memory MongoDB at ${uri}`);
    }
    catch (error) {
        console.log(`MongoDB connection error: ${error}`);
        throw new Error("Failed to connect to MongoDB");
    }
}));
afterAll(() => __awaiter(void 0, void 0, void 0, function* () {
    yield mongoose.disconnect();
    yield mongoServer.stop();
}));
beforeEach(() => __awaiter(void 0, void 0, void 0, function* () {
    yield Item.deleteMany({});
}));
describe("updateStock", () => {
    it("should update stock with valid quantity", () => __awaiter(void 0, void 0, void 0, function* () {
        const item = yield Item.create({
            name: "Sample Item",
            description: "A space filler",
            stockQuantity: 20,
            price: 100,
        });
        const result = yield updateStock(item._id, 30);
        if (result) {
            expect(result.stockQuantity).toEqual(30);
        }
    }));
    it("should throw an error for negative quantity", () => __awaiter(void 0, void 0, void 0, function* () {
        const item = yield Item.create({
            name: "Sample Item",
            description: "A space filler",
            stockQuantity: 20,
            price: 100,
        });
        yield expect(updateStock(item._id, -5)).rejects.toThrow("Stock quantity cannot be negative");
    }));
});
describe("checkStock", () => {
    it("should return true if stock is upto quantity", () => __awaiter(void 0, void 0, void 0, function* () {
        const item = yield Item.create({
            name: "Sample Item",
            description: "A space filler",
            stockQuantity: 10,
            price: 100,
        });
        const result = yield checkStock(item._id, 10);
        expect(result).toBe(true);
    }));
    it("should return false if stock is not upto quantity", () => __awaiter(void 0, void 0, void 0, function* () {
        const item = yield Item.create({
            name: "Sample Item",
            description: "A space filler",
            stockQuantity: 10,
            price: 100,
        });
        const result = yield checkStock(item._id, 20);
        expect(result).toBe(false);
    }));
});
describe("getItem", () => {
    it("should fetch inventory item with stock quantiy and description", () => __awaiter(void 0, void 0, void 0, function* () {
        const item = yield Item.create({
            name: "Sample Item",
            description: "A space filler",
            stockQuantity: 40,
            price: 100,
        });
        const result = yield getItem(item._id);
        expect(result).toEqual(expect.objectContaining({
            description: "A space filler",
            name: "Sample Item",
            price: 100,
            stockQuantity: 40,
        }));
    }));
});
