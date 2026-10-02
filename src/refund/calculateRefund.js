import { AppError } from "../errors.js";
import { round2 } from "../pricing/calculatePrice.js";

export function calculateRefund({ price, paid, cancelledByOrganizer = false, daysBefore }) {
  if (typeof price !== "number" || !Number.isFinite(price) || price < 0) {
    throw new AppError("INVALID_PRICE", "Hind peab olema mittenegatiivne arv");
  }
  if (!Number.isInteger(daysBefore)) {
    throw new AppError("INVALID_DAYS", "Päevade arv peab olema täisarv");
  }

  if (!paid) return 0;
  if (cancelledByOrganizer) return round2(price);
  if (daysBefore >= 7) return round2(price);
  if (daysBefore >= 2) return round2(price * 0.5);
  return 0;
}
