export class AppError extends Error {
  constructor(message, { statusCode = 400, details } = {}) {
    super(message);
    this.statusCode = statusCode;
    this.details = details;
  }
}

export function assert(condition, message, opts) {
  if (!condition) throw new AppError(message, opts);
}

