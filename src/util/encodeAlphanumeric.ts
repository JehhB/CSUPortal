export function encodeAlphanumeric(input: string): string {
  const allowedChars = /^[0-9A-Z $%*+\-./:]+$/;
  return Array.from(input.toUpperCase())
    .filter((char) => allowedChars.test(char))
    .join("");
}
