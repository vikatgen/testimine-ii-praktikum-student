export class AppError extends Error {
  constructor(code, message) {
    super(message);
    this.name = "AppError";
    this.code = code;
  }
}

export const STATUS_BY_CODE = {
  INVALID_AGE: 400,
  INVALID_GROUP_SIZE: 400,
  INVALID_PRICE: 400,
  INVALID_EMAIL: 400,
  INVALID_CAPACITY: 400,
  INVALID_TITLE: 400,
  INVALID_DATE: 400,
  INVALID_DAYS: 400,
  INVALID_ID: 400,
  WORKSHOP_NOT_FOUND: 404,
  REGISTRATION_NOT_FOUND: 404,
  WORKSHOP_NOT_OPEN: 409,
  WORKSHOP_FULL: 409,
  ALREADY_REGISTERED: 409,
  INVALID_TRANSITION: 409,
};
