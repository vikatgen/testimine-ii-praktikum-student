
export class InMemoryWorkshopRepository {
  #items = new Map();
  #nextId = 1;

  async create(data) {
    const workshop = { id: this.#nextId++, ...data };
    this.#items.set(workshop.id, workshop);
    return { ...workshop };
  }

  async findById(id) {
    const found = this.#items.get(id);
    return found ? { ...found } : null;
  }

  async findAll() {
    return [...this.#items.values()].map((w) => ({ ...w }));
  }

  async save(workshop) {
    this.#items.set(workshop.id, { ...workshop });
  }
}

export class InMemoryRegistrationRepository {
  #items = new Map();
  #nextId = 1;

  async add(data) {
    const registration = { id: this.#nextId++, ...data };
    this.#items.set(registration.id, registration);
    return { ...registration };
  }

  async findById(id) {
    const found = this.#items.get(id);
    return found ? { ...found, ages: [...found.ages] } : null;
  }

  async findByWorkshop(workshopId) {
    return [...this.#items.values()]
      .filter((r) => r.workshopId === workshopId)
      .map((r) => ({ ...r, ages: [...r.ages] }));
  }

  async findAll() {
    return [...this.#items.values()].map((r) => ({ ...r, ages: [...r.ages] }));
  }

  async update(registration) {
    this.#items.set(registration.id, { ...registration });
  }

  async remove(id) {
    this.#items.delete(id);
  }
}

export const systemClock = { now: () => new Date() };

export const silentNotifier = {
  async sendConfirmation() {},
  async sendCancellation() {},
};
