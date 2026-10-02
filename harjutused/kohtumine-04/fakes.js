export class FixedClock {
  constructor(isoDate) {
    this.date = new Date(isoDate);
  }
  now() {
    return this.date;
  }
}

export class SpyNotifier {
  confirmations = [];
  cancellations = [];

  async sendConfirmation(data) {
    this.confirmations.push(data);
  }
  async sendCancellation(data) {
    this.cancellations.push(data);
  }
}

export class FailingNotifier {
  async sendConfirmation() {
    throw new Error("Pole teostatud");
  }
  async sendCancellation() {
    throw new Error("Pole teostatud");
  }
}

export class FakeWorkshopRepository {
  constructor(workshops = []) {
    this.workshops = workshops;
    this.saved = [];
  }
  async findById() {
    throw new Error("Pole teostatud");
  }
  async save() {
    throw new Error("Pole teostatud");
  }
}

export class FakeRegistrationRepository {
  constructor(registrations = []) {
    this.registrations = registrations;
  }
  async findById() {
    throw new Error("Pole teostatud");
  }
  async findByWorkshop() {
    throw new Error("Pole teostatud");
  }
  async add() {
    throw new Error("Pole teostatud");
  }
  async update() {
    throw new Error("Pole teostatud");
  }
  async remove() {
    throw new Error("Pole teostatud");
  }
}
