import express from "express";
import { AppError, STATUS_BY_CODE } from "../errors.js";
import {
  InMemoryRegistrationRepository,
  InMemoryWorkshopRepository,
  silentNotifier,
  systemClock,
} from "../infrastructure/inMemory.js";
import { RegistrationService } from "../registration/RegistrationService.js";
import { WorkshopService } from "../workshop/WorkshopService.js";

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

function parseId(raw, code = "INVALID_ID") {
  const id = Number(raw);
  if (!/^\d+$/.test(String(raw)) || !Number.isInteger(id) || id < 1) {
    throw new AppError(code, "ID peab olema positiivne täisarv");
  }
  return id;
}

export function createApp({
  clock = systemClock,
  notifier = silentNotifier,
  reportDelayMs = 100,
} = {}) {
  const workshopRepo = new InMemoryWorkshopRepository();
  const registrationRepo = new InMemoryRegistrationRepository();
  const workshopService = new WorkshopService({
    workshops: workshopRepo,
    registrations: registrationRepo,
  });
  const registrationService = new RegistrationService({
    workshops: workshopRepo,
    registrations: registrationRepo,
    notifier,
    clock,
  });

  const app = express();
  app.use(express.json());

  const wrap = (handler) => (req, res, next) => handler(req, res).catch(next);

  app.get("/health", (req, res) => res.json({ status: "ok" }));

  app.post("/workshops", wrap(async (req, res) => {
    res.status(201).json(await workshopService.create(req.body ?? {}));
  }));

  app.get("/workshops", wrap(async (req, res) => {
    res.json(await workshopService.list());
  }));

  app.get("/workshops/:id", wrap(async (req, res) => {
    res.json(await workshopService.get(parseId(req.params.id)));
  }));

  app.post("/workshops/:id/publish", wrap(async (req, res) => {
    res.json(await workshopService.publish(parseId(req.params.id)));
  }));

  app.post("/workshops/:id/registrations", wrap(async (req, res) => {
    const workshopId = parseId(req.params.id);
    const { email, ages, member } = req.body ?? {};
    const created = await registrationService.register({ workshopId, email, ages, member });
    res.status(201).json(created);
  }));

  app.get("/registrations/:id", wrap(async (req, res) => {
    const registration = await registrationRepo.findById(parseId(req.params.id));
    if (!registration) throw new AppError("REGISTRATION_NOT_FOUND", "Registreeringut ei leitud");
    res.json(registration);
  }));

  app.post("/registrations/:id/pay", wrap(async (req, res) => {
    res.json(await registrationService.markPaid(parseId(req.params.id)));
  }));

  app.delete("/registrations/:id", wrap(async (req, res) => {
    const cancelledByOrganizer = req.query.cancelledBy === "organizer";
    res.json(await registrationService.cancel(parseId(req.params.id), { cancelledByOrganizer }));
  }));

  let reportCalls = 0;
  app.get("/reports/summary", wrap(async (req, res) => {
    reportCalls += 1;
    await sleep(reportCalls % 10 === 0 ? reportDelayMs * 5 : reportDelayMs);
    const workshops = await workshopRepo.findAll();
    const registrations = await registrationRepo.findAll();
    res.json({
      workshops: workshops.length,
      registrations: registrations.length,
      revenue: registrations.filter((r) => r.paid).reduce((sum, r) => sum + r.price, 0),
    });
  }));

  app.use((err, req, res, next) => {
    if (err instanceof AppError) {
      return res
        .status(STATUS_BY_CODE[err.code] ?? 400)
        .json({ error: { code: err.code, message: err.message } });
    }
    if (err?.type === "entity.parse.failed") {
      return res.status(400).json({ error: { code: "INVALID_JSON", message: "Vigane JSON" } });
    }
    console.error(err);
    res.status(500).json({ error: { code: "INTERNAL_ERROR", message: "Serveri viga" } });
  });

  return app;
}
