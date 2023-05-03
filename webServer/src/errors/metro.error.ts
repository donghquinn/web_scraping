export class MetroError extends Error {
  type: string;

  constructor(type: string, message: string, cause?: Error) {
    super(message);

    this.type = type;

    this.name = '[Metro Error]';

    this.cause = cause;
  }
}
