import commonPasswords from "./commonPasswords";

export function hasNumber(str: string): boolean {
  return /\d/.test(str);
}

export function hasLowercase(str: string): boolean {
  return /[a-z]/.test(str);
}

export function hasUppercase(str: string): boolean {
  return /[A-Z]/.test(str);
}

export function isLongerThan(length: number, str: string): boolean {
  return str.length > length;
}

export function isNotCommonPassword(str: string): boolean {
  return !commonPasswords.has(str.toLowerCase());
}
