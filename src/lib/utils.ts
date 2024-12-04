import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import { type SyntheticEvent } from "react";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function preventDefault(e: SyntheticEvent) {
  e.preventDefault();
}

export function debounce(waitFor: number, fn: CallableFunction) {
  let timeout: NodeJS.Timeout;

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  return function (...innerArgs: any[]) {
    clearTimeout(timeout);

    // eslint-disable-next-line @typescript-eslint/no-unsafe-return, @typescript-eslint/no-unsafe-argument, @typescript-eslint/no-unsafe-call
    timeout = setTimeout(() => fn(...innerArgs), waitFor);
  };
}
