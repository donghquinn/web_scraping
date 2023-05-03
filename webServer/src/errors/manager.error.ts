export class ManagerError extends Error {
  type: string;

  constructor(type: string, message: string, cause?: Error) {
    super(message);

    this.type = type;

    this.name = '[Manager Error]';

    this.cause = cause;
  }
}
