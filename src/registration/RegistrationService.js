import { AppError } from "../errors.js";
import { calculatePrice } from "../pricing/calculatePrice.js";
import { calculateRefund } from "../refund/calculateRefund.js";
import { nextState } from "../workshop/workshopState.js";

const DAY_MS = 24 * 60 * 60 * 1000;
const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

/**
 * Registreerimise äriloogika. Sõltuvused (pordid) antakse konstruktoris ette:
 *
 *  workshops:     findById(id) -> workshop | null,  save(workshop)
 *  registrations: findById(id) -> registration | null,  findByWorkshop(workshopId) -> [registration],
 *                 add(data) -> registration (lisab `id`),  update(registration),  remove(id)
 *  notifier:      sendConfirmation({ email, workshopTitle, price }),
 *                 sendCancellation({ email, workshopTitle, refund })
 *  clock:         now() -> Date
 */
export class RegistrationService {
  constructor({ workshops, registrations, notifier, clock }) {
    this.workshops = workshops;
    this.registrations = registrations;
    this.notifier = notifier;
    this.clock = clock;
  }

  async register({ workshopId, email, ages, member = false }) {
    if (typeof email !== "string" || !EMAIL_PATTERN.test(email)) {
      throw new AppError("INVALID_EMAIL", "E-posti aadress on vigane");
    }

    const workshop = await this.workshops.findById(workshopId);
    if (!workshop) throw new AppError("WORKSHOP_NOT_FOUND", "Töötuba ei leitud");
    if (workshop.status !== "open") {
      throw new AppError("WORKSHOP_NOT_OPEN", "Töötuba ei ole registreerimiseks avatud");
    }

    const price = calculatePrice({ basePrice: workshop.basePrice, ages, member });

    const existing = await this.registrations.findByWorkshop(workshopId);
    const normalizedEmail = email.trim().toLowerCase();
    if (existing.some((r) => r.email === normalizedEmail)) {
      throw new AppError("ALREADY_REGISTERED", "See e-post on sellele töötoale juba registreeritud");
    }

    const taken = existing.reduce((sum, r) => sum + r.ages.length, 0);
    if (ages.length > workshop.capacity - taken) {
      throw new AppError("WORKSHOP_FULL", "Vabu kohti ei ole piisavalt");
    }

    const registration = await this.registrations.add({
      workshopId,
      email: normalizedEmail,
      ages,
      member,
      price,
      paid: false,
    });

    if (taken + ages.length === workshop.capacity) {
      workshop.status = nextState(workshop.status, "fill");
      await this.workshops.save(workshop);
    }

    let confirmationSent = true;
    try {
      await this.notifier.sendConfirmation({
        email: normalizedEmail,
        workshopTitle: workshop.title,
        price,
      });
    } catch {
      confirmationSent = false;
    }

    return { ...registration, confirmationSent };
  }

  async markPaid(registrationId) {
    const registration = await this.registrations.findById(registrationId);
    if (!registration) throw new AppError("REGISTRATION_NOT_FOUND", "Registreeringut ei leitud");
    registration.paid = true;
    await this.registrations.update(registration);
    return registration;
  }

  async cancel(registrationId, { cancelledByOrganizer = false } = {}) {
    const registration = await this.registrations.findById(registrationId);
    if (!registration) throw new AppError("REGISTRATION_NOT_FOUND", "Registreeringut ei leitud");

    const workshop = await this.workshops.findById(registration.workshopId);
    const daysBefore = Math.floor((new Date(workshop.startsAt) - this.clock.now()) / DAY_MS);

    const refund = calculateRefund({
      price: registration.price,
      paid: registration.paid,
      cancelledByOrganizer,
      daysBefore,
    });

    await this.registrations.remove(registrationId);

    if (workshop.status === "full") {
      workshop.status = nextState(workshop.status, "freeSpot");
      await this.workshops.save(workshop);
    }

    await this.notifier.sendCancellation({
      email: registration.email,
      workshopTitle: workshop.title,
      refund,
    });

    return { refund };
  }
}
