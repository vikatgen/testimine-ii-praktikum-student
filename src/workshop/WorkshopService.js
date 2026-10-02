import { AppError } from "../errors.js";
import { nextState } from "./workshopState.js";

export class WorkshopService {
  constructor({ workshops, registrations }) {
    this.workshops = workshops;
    this.registrations = registrations;
  }

  async create({ title, capacity, basePrice, startsAt }) {
    if (typeof title !== "string" || title.trim() === "") {
      throw new AppError("INVALID_TITLE", "Pealkiri on kohustuslik");
    }
    if (!Number.isInteger(capacity) || capacity < 1) {
      throw new AppError("INVALID_CAPACITY", "Mahutavus peab olema positiivne täisarv");
    }
    if (typeof basePrice !== "number" || !Number.isFinite(basePrice) || basePrice <= 0) {
      throw new AppError("INVALID_PRICE", "Põhihind peab olema positiivne arv");
    }
    if (typeof startsAt !== "string" || Number.isNaN(Date.parse(startsAt))) {
      throw new AppError("INVALID_DATE", "Algusaeg peab olema ISO kuupäev");
    }
    const workshop = await this.workshops.create({
      title: title.trim(),
      capacity,
      basePrice,
      startsAt,
      status: "draft",
    });
    return this.#withSpots(workshop);
  }

  async get(id) {
    const workshop = await this.workshops.findById(id);
    if (!workshop) throw new AppError("WORKSHOP_NOT_FOUND", "Töötuba ei leitud");
    return this.#withSpots(workshop);
  }

  async list() {
    const all = await this.workshops.findAll();
    return Promise.all(all.map((w) => this.#withSpots(w)));
  }

  async publish(id) {
    const workshop = await this.workshops.findById(id);
    if (!workshop) throw new AppError("WORKSHOP_NOT_FOUND", "Töötuba ei leitud");
    workshop.status = nextState(workshop.status, "publish");
    await this.workshops.save(workshop);
    return this.#withSpots(workshop);
  }

  async #withSpots(workshop) {
    const regs = await this.registrations.findByWorkshop(workshop.id);
    const taken = regs.reduce((sum, r) => sum + r.ages.length, 0);
    return { ...workshop, availableSpots: workshop.capacity - taken };
  }
}
