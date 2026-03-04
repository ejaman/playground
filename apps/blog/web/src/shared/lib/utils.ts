import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import { format, parseISO } from "date-fns";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatDateYMD(isoDate: string) {
  try {
    return format(parseISO(isoDate), "yyyy-MM-dd");
  } catch {
    return isoDate;
  }
}
