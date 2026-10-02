import { describe, expect, it } from "vitest";
import { calculateRefund } from "../../src/refund/calculateRefund.js";

describe("calculateRefund (NR-12)", () => {
  it("NR-12: maksmata registreering", () => {
    expect(calculateRefund({ price: 50, paid: false, cancelledByOrganizer: false, daysBefore: 30 })).toBe(0);
    expect(calculateRefund({ price: 50, paid: false, cancelledByOrganizer: true, daysBefore: 30 })).toBe(0);
  });

  it("NR-12: korraldaja tühistas", () => {
    expect.fail("Test on kirjutamata");
  });

  it("NR-12: vähemalt 7 päeva enne", () => {
    expect.fail("Test on kirjutamata");
  });

  it("NR-12: 2 kuni 6 päeva enne", () => {
    expect.fail("Test on kirjutamata");
  });

  it("NR-12: vähem kui 2 päeva enne", () => {
    expect.fail("Test on kirjutamata");
  });

  it("NR-12: piirväärtused", () => {
    expect.fail("Test on kirjutamata");
  });

  it("NR-12: vigased sisendid", () => {
    expect.fail("Test on kirjutamata");
  });
});
