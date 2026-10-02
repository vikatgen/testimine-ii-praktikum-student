import { describe, expect, it } from "vitest";
import { nextState } from "../../src/workshop/workshopState.js";

describe("nextState (NR-13)", () => {
  it("NR-13: draft + publish => open", () => {
    expect(nextState("draft", "publish")).toBe("open");
  });

  it("NR-13: lubatud üleminekud", () => {
    expect.fail("Test on kirjutamata");
  });

  it("NR-13: keelatud üleminekud", () => {
    expect.fail("Test on kirjutamata");
  });

  it("NR-13: closed olek", () => {
    expect.fail("Test on kirjutamata");
  });
});
