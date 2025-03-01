import crypto from "crypto";
import { env } from "@/env";

const base64urlEncode = (str: string): string => {
  return Buffer.from(str)
    .toString("base64")
    .replace(/\+/g, "-")
    .replace(/\//g, "_")
    .replace(/=/g, "");
};

const base64urlDecode = (str: string): string => {
  // Add padding back
  str = str.replace(/-/g, "+").replace(/_/g, "/");
  switch (str.length % 4) {
    case 0:
      break;
    case 2:
      str += "==";
      break;
    case 3:
      str += "=";
      break;
    default:
      throw new Error("Invalid base64url string");
  }
  return Buffer.from(str, "base64").toString();
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
    .update(stringifiedHeader + "-__--__-" + stringifiedPayload)
    .digest("base64url");

  return (
    stringifiedHeader + "-__--__-" + stringifiedPayload + "-__--__-" + signature
  );
};

export const verifyJWT = (
  token: string,
): { success: boolean; payload: unknown } => {
  const [header, payload, signature] = token.split("-__--__-");
  if (!header || !payload || !signature) {
    return {
      success: false,
      payload: null,
    };
  }

  const signatureToVerify = crypto
    .createHmac("sha256", env.TELEGRAM_SECRET)
    .update(header + "-__--__-" + payload)
    .digest("base64url");

  const success = signatureToVerify === signature;
  return {
    success,
    payload: success ? JSON.parse(base64urlDecode(payload)) : null,
  };
};
