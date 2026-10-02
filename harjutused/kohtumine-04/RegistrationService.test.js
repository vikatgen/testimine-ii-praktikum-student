import { beforeEach, describe, expect, it, vi } from "vitest";
import { RegistrationService } from "../../src/registration/RegistrationService.js";
import {
  FailingNotifier,
  FakeRegistrationRepository,
  FakeWorkshopRepository,
  FixedClock,
  SpyNotifier,
} from "./fakes.js";

const openWorkshop = (overrides = {}) => ({
  id: 1,
  title: "Keraamika",
  capacity: 4,
  basePrice: 20,
  startsAt: "2030-06-20T10:00:00Z",
  status: "open",
  ...overrides,
});

describe("RegistrationService koos vi.fn() mockidega", () => {
  it("NR-8: õnnestunud registreerimine lisab registreeringu ja saadab kinnituse", async () => {
    const workshops = { findById: vi.fn().mockResolvedValue(openWorkshop()), save: vi.fn() };
    const registrations = {
      findByWorkshop: vi.fn().mockResolvedValue([]),
      add: vi.fn().mockImplementation(async (data) => ({ id: 7, ...data })),
    };
    const notifier = { sendConfirmation: vi.fn().mockResolvedValue(undefined) };
    const service = new RegistrationService({ workshops, registrations, notifier, clock: {} });

    const result = await service.register({ workshopId: 1, email: "Kati@Mail.ee", ages: [30] });

    expect(result.id).toBe(7);
    expect(registrations.add).toHaveBeenCalledWith(expect.objectContaining({ email: "kati@mail.ee", price: 20 }));
    expect(notifier.sendConfirmation).toHaveBeenCalledTimes(1);
  });
});

describe("RegistrationService koos oma fake-klassidega", () => {
  let workshops;
  let registrations;
  let notifier;
  let clock;
  let service;

  beforeEach(() => {
    workshops = new FakeWorkshopRepository([openWorkshop()]);
    registrations = new FakeRegistrationRepository();
    notifier = new SpyNotifier();
    clock = new FixedClock("2030-06-10T10:00:00Z");
    service = new RegistrationService({ workshops, registrations, notifier, clock });
  });

  it("NR-8: edukas registreerimine", async () => {
    expect.fail("Test on kirjutamata");
  });

  it("NR-8: töötuba ei ole registreerimiseks sobiv", async () => {
    expect.fail("Test on kirjutamata");
  });

  it("NR-9: vabade kohtade puudus", async () => {
    expect.fail("Test on kirjutamata");
  });

  it("NR-10: korduv registreerimine", async () => {
    expect.fail("Test on kirjutamata");
  });

  it("NR-13: töötuba täitub", async () => {
    expect.fail("Test on kirjutamata");
  });

  it("NR-11: kinnituse saatmine ebaõnnestub", async () => {
    expect.fail("Test on kirjutamata");
  });

  it("NR-12: tühistamine", async () => {
    expect.fail("Test on kirjutamata");
  });
});
