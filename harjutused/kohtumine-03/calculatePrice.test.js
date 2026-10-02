import { describe, expect, it } from "vitest";
import { calculatePrice, participantFactor } from "../../src/pricing/calculatePrice.js";

describe("participantFactor (NR-1, NR-2)", () => {
  it("NR-2: täiskasvanu (30) maksab täishinna", () => {
    const factor = participantFactor(30);
    expect(factor).toBe(1);
  });

  it("NR-2: lapse hind", () => {
    expect.fail("Test on kirjutamata");
  });

  it("NR-2: eaka hind", () => {
    expect.fail("Test on kirjutamata");
  });

  it("NR-1: vigane vanus", () => {
    expect.fail("Test on kirjutamata");
  });
});

describe("calculatePrice (NR-3 ... NR-7)", () => {
  it("NR-2: üks täiskasvanu maksab põhihinna", () => {
    expect(calculatePrice({ basePrice: 20, ages: [30] })).toBe(20);
  });

  it("NR-3: osalejate arv", () => {
    expect.fail("Test on kirjutamata");
  });

  it("NR-4: grupisoodus", () => {
    expect.fail("Test on kirjutamata");
  });

  it("NR-5, NR-6: liikmesoodus ja soodustuste koosmõju", () => {
    expect.fail("Test on kirjutamata");
  });

  it("NR-7: ümardamine", () => {
    expect.fail("Test on kirjutamata");
  });

  it("NR-14: vigane põhihind", () => {
    expect.fail("Test on kirjutamata");
  });
});
