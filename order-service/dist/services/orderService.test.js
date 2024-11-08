import { checkStock } from "./orderService";
describe("checkStock", () => {
    it("should return true if stock is upto quantity", () => {
        const result = checkStock(10, 20);
        expect(result).toBe(true);
    });
    it("should return false if stock is not upto quantity", () => {
        const result = checkStock(30, 20);
        expect(result).toBe(false);
    });
});
// describe("createOrder", () => {
//   it("should create Order", () => {
//     const result = createOrder({ itemId: "item123", quantity: 10 });
//     expect(result).toEqual({ itemId: "item123", quantity: 10 });
//   });
// });
