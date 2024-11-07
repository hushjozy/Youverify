import { updateInventoryStock } from "./inventory.controller";

describe("updateStock", () => {
  it("should update stock with valid quantity", () => {
    const result = updateInventoryStock("item123", 10);
    expect(result).toEqual({ itemId: "item123", quantity: 10 });
  });

  it("should throw an error for negative quantity", () => {
    expect(() => updateInventoryStock("item123", -5)).toThrow(
      "Stock quantity cannot be negative"
    );
  });
});
