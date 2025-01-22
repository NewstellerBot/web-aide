import { ZodError } from "zod";

import { TelegramError } from "./errors";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const apiWrapper = <T extends Array<any>>(
  fn: (...args: T) => Promise<Response>,
) => {
  return async (...args: T): Promise<Response> => {
    try {
      return await fn(...args);
    } catch (e) {
      if (e instanceof TelegramError)
        return Response.json(
          { type: e.name, message: e.message },
          { status: 400 },
        );
      if (e instanceof ZodError)
        return Response.json(
          { type: "BAD_REQUEST", message: "Bad request" },
          { status: 400 },
        );
      if (e instanceof Error)
        return Response.json({ message: e.message }, { status: 400 });
      if (typeof e === "string")
        return Response.json({ message: e }, { status: 400 });
      return Response.json({ message: "Unknown error" }, { status: 500 });
    }
  };
};
