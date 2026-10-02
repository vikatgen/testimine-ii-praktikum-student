import { describe, expect, it } from "vitest";
import { calculatePrice } from "../../src/pricing/calculatePrice.js";
import { calculateRefund } from "../../src/refund/calculateRefund.js";
import { nextState } from "../../src/workshop/workshopState.js";

describe("testikomplekt", () => {
  it("calculatePrice annab positiivse arvu", () => {
    expect(calculatePrice({ basePrice: 10, ages: [30] })).toBeGreaterThan(0);
    expect(calculatePrice({ basePrice: 10, ages: [10, 30, 70, 30, 30, 30, 30, 30, 30, 30], member: true })).toBeGreaterThan(0);
    expect(calculatePrice({ basePrice: 10, ages: [30, 30, 30, 30, 30], member: false })).toBeTypeOf("number");
  });

  it("calculateRefund annab arvu", () => {
    expect(calculateRefund({ price: 50, paid: true, daysBefore: 10 })).toBeTypeOf("number");
    expect(calculateRefund({ price: 50, paid: true, daysBefore: 3 })).toBeTypeOf("number");
    expect(calculateRefund({ price: 50, paid: true, cancelledByOrganizer: true, daysBefore: 0 })).toBeTypeOf("number");
    expect(calculateRefund({ price: 50, paid: false, daysBefore: 0 })).toBeTypeOf("number");
  });

  it("nextState annab teksti", () => {
    expect(nextState("draft", "publish")).toBeTypeOf("string");
    expect(nextState("open", "fill")).toBeTypeOf("string");
    expect(nextState("full", "freeSpot")).toBeTypeOf("string");
  });

  it("vigased sisendid annavad vea", () => {
    expect(() => calculatePrice({ basePrice: 0, ages: [30] })).toThrow();
    expect(() => calculatePrice({ basePrice: 10, ages: [] })).toThrow();
    expect(() => calculatePrice({ basePrice: 10, ages: [3] })).toThrow();
    expect(() => calculateRefund({ price: -1, paid: true, daysBefore: 3 })).toThrow();
    expect(() => calculateRefund({ price: 10, paid: true, daysBefore: 1.5 })).toThrow();
    expect(() => nextState("closed", "publish")).toThrow();
  });

  it("calculateRefund vähem kui 2 päeva enne annab arvu", () => {
    expect(calculateRefund({ price: 50, paid: true, daysBefore: 1 })).toBeTypeOf("number");
  });
});
