import { AppError } from "../errors.js";

export const MIN_AGE = 7;
export const MAX_AGE = 120;
export const MIN_GROUP = 1;
export const MAX_GROUP = 20;

export function round2(value) {
  return Math.round(value * 100) / 100;
}

export function participantFactor(age) {
  if (!Number.isInteger(age) || age < MIN_AGE || age > MAX_AGE) {
    throw new AppError("INVALID_AGE", `Vanus peab olema täisarv ${MIN_AGE}–${MAX_AGE}`);
  }
  if (age <= 17) return 0.5;
  if (age >= 65) return 0.8;
  return 1;
}

export function calculatePrice({ basePrice, ages, member = false }) {
  if (typeof basePrice !== "number" || !Number.isFinite(basePrice) || basePrice <= 0) {
    throw new AppError("INVALID_PRICE", "Põhihind peab olema positiivne arv");
  }
  if (!Array.isArray(ages) || ages.length < MIN_GROUP || ages.length > MAX_GROUP) {
    throw new AppError("INVALID_GROUP_SIZE", `Osalejaid peab olema ${MIN_GROUP}–${MAX_GROUP}`);
  }

  const subtotal = ages.reduce((sum, age) => sum + basePrice * participantFactor(age), 0);

  const groupDiscount = ages.length >= 10 ? 0.15 : ages.length >= 5 ? 0.1 : 0;
  const memberDiscount = member ? 0.1 : 0;
  const discount = Math.max(groupDiscount, memberDiscount);

  return round2(subtotal * (1 - discount));
}
