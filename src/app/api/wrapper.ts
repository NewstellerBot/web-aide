import { ZodError } from "zod";
import { AideError } from "@/lib/errors";
import { TelegramError } from "./telegram/errors";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const apiWrapper = <T extends Array<any>>(
  fn: (...args: T) => Promise<Response>,
) => {
  return async (...args: T): Promise<Response> => {
    try {
      return await fn(...args);
    } catch (e) {
      console.error("[API Error]: " + JSON.stringify(e));
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
      if (e instanceof AideError) {
        switch (e.name) {
          case "DB_ERROR":
            return Response.json({ message: e.message }, { status: 404 });
          case "EXECUTION_ERROR":
            return Response.json({ message: e.message }, { status: 400 });
          case "LLM_ERROR":
            return Response.json({ message: e.message }, { status: 500 });
          case "PARSING_ERROR":
            return Response.json({ message: "Unknown error" }, { status: 500 });
        }
      }
      if (e instanceof Error)
        return Response.json({ message: e.message }, { status: 400 });
      if (typeof e === "string")
        return Response.json({ message: e }, { status: 400 });
      return Response.json({ message: "Unknown error" }, { status: 500 });
    }
  };
};
