import { describe, expect, it } from "vitest";
import { client } from "../tugi/client.js";
import { createOpenWorkshop, isoDaysFromNow, uniqueEmail, uniqueTitle } from "../tugi/helpers.js";

describe("POST /workshops/:id/registrations", () => {
  it("NR-8: registreerimine õnnestub", async () => {
    const api = client();
    const workshop = await createOpenWorkshop(api, { capacity: 6, basePrice: 20 });

    const res = await api
      .post(`/workshops/${workshop.id}/registrations`)
      .send({ email: uniqueEmail(), ages: [30, 10] });

    expect(res.status).toBe(201);
    expect(res.body.price).toBe(30);
    const after = await api.get(`/workshops/${workshop.id}`);
    expect(after.body.availableSpots).toBe(4);
  });

  it("NR-8: e-posti kontroll", async () => {
    expect.fail("Test on kirjutamata");
  });

  it("NR-8: mitteavatud ja olematu töötuba", async () => {
    expect.fail("Test on kirjutamata");
  });

  it("NR-9: täis töötuba", async () => {
    expect.fail("Test on kirjutamata");
  });

  it("NR-10: korduv e-post", async () => {
    expect.fail("Test on kirjutamata");
  });

  it("NR-2, NR-4, NR-5, NR-6: hinnad", async () => {
    expect.fail("Test on kirjutamata");
  });
});

describe("DELETE /registrations/:id", () => {
  it("NR-12: makstud registreeringu tühistamine", async () => {
    expect.fail("Test on kirjutamata");
  });

  it("API: vigased ja olematud id-d", async () => {
    expect.fail("Test on kirjutamata");
  });
});

describe("Samaaegsed päringud", () => {
  it("NR-9: kaks registreerimist ühe koha peale", async () => {
    expect.fail("Test on kirjutamata");
  });
});
