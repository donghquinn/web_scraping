export class ClimateError extends Error {
  type: string;

  constructor(type: string, message: string, cause?: Error) {
    super(message);

    this.type = type;

    this.name = '[Climate Error]';

    this.cause = cause;
  }
}
