import crypto from "crypto";
import { env } from "@/env";

const base64urlEncode = (str: string): string => {
  return Buffer.from(str)
    .toString("base64")
    .replace(/\+/g, "-")
    .replace(/\//g, "_")
    .replace(/=/g, "");
};

export const signJWT = (payload: object) => {
  const header = {
    alg: "HS256",
    typ: "JWT",
  };
  const stringifiedHeader = base64urlEncode(JSON.stringify(header));
  const stringifiedPayload = base64urlEncode(JSON.stringify(payload));

  const signature = crypto
    .createHmac("sha256", env.TELEGRAM_SECRET)
    .update(stringifiedHeader + "." + stringifiedPayload)
    .digest("base64url");

  return stringifiedHeader + "." + stringifiedPayload + "." + signature;
};

export const verifyJWT = (token: string) => {
  const [header, payload, signature] = token.split(".");
  const signatureToVerify = crypto
    .createHmac("sha256", env.TELEGRAM_SECRET)
    .update(header + "." + payload)
    .digest("base64");
  return signatureToVerify === signature;
};
