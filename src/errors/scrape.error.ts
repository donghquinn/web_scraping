export class ScrapeError extends Error {
  type: string;

  constructor(type: string, message: string, cause?: Error) {
    super(message);

    this.type = type;

    this.cause = cause;
  }
}
