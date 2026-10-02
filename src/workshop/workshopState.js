import { AppError } from "../errors.js";

const TRANSITIONS = {
  draft: { publish: "open", close: "closed" },
  open: { fill: "full", close: "closed" },
  full: { freeSpot: "open", close: "closed" },
  closed: {},
};

export function nextState(state, event) {
  const next = TRANSITIONS[state]?.[event];
  if (!next) {
    throw new AppError("INVALID_TRANSITION", `Olekust "${state}" ei saa sündmusega "${event}" edasi`);
  }
  return next;
}
