export abstract class DomainError extends Error {
  abstract readonly statusCode: number;

  constructor(message: string) {
    super(message);
    Object.setPrototypeOf(this, new.target.prototype);
  }
}

export class NotFoundError extends DomainError {
  readonly statusCode = 404;

  constructor(entity: string, identifier: string | number) {
    super(`${entity} with identifier '${identifier}' was not found`);
  }
}

export class BadRequestError extends DomainError {
  readonly statusCode = 400;

  constructor(message: string) {
    super(message);
  }
}

export class ConflictError extends DomainError {
  readonly statusCode = 409;

  constructor(message: string) {
    super(message);
  }
}
