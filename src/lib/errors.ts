export type ErrorName =
  | "LLM_ERROR"
  | "PARSING_ERROR"
  | "EXECUTION_ERROR"
  | "DB_ERROR"
  | "SERVER_ERROR"
  | "BAD_REQUEST"
  | "FILE_TYPE_ERROR"
  | "NOT_FOUND";

export class AideError extends Error {
  name: ErrorName;
  message: string;
  cause: unknown;

  constructor({
    name,
    message,
    cause,
  }: {
    name: ErrorName;
    message: string;
    cause?: unknown;
  }) {
    super();
    this.message = message;
    this.name = name;
    this.cause = cause;
  }
}

export class FileTypeError extends AideError {
  constructor(message: string, cause?: unknown) {
    super({
      name: "FILE_TYPE_ERROR",
      message,
      cause,
    });
  }
}
