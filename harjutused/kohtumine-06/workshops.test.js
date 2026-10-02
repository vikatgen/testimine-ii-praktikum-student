import { describe, expect, it } from "vitest";
import { client } from "../tugi/client.js";
import { isoDaysFromNow, uniqueTitle } from "../tugi/helpers.js";

const validBody = () => ({
  title: uniqueTitle("Keraamika"),
  capacity: 8,
  basePrice: 25,
  startsAt: isoDaysFromNow(10),
});

describe("POST /workshops (NR-14)", () => {
  it("NR-14: loob töötoa", async () => {
    const api = client();
    const body = validBody();

    const res = await api.post("/workshops").send(body);

    expect(res.status).toBe(201);
    expect(res.body).toMatchObject({ title: body.title, status: "draft", availableSpots: 8 });
    expect(res.body.id).toEqual(expect.any(Number));
  });

  it("NR-14: vigane mahutavus", async () => {
    expect.fail("Test on kirjutamata");
  });

  it("NR-14: vigased pealkiri, hind ja kuupäev", async () => {
    expect.fail("Test on kirjutamata");
  });
});

describe("GET /workshops ja GET /workshops/:id", () => {
  it("NR-14: loodud töötuba on nimekirjas ja päritav id järgi", async () => {
    expect.fail("Test on kirjutamata");
  });

  it("API: puuduv töötuba ja vigased id-d", async () => {
    expect.fail("Test on kirjutamata");
  });
});

describe("POST /workshops/:id/publish", () => {
  it("NR-13: töötoa avamine", async () => {
    expect.fail("Test on kirjutamata");
  });
});
