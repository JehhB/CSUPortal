export default function splitAt(
  input: string,
  delimiter: string | RegExp,
): [string, string] {
  const index = input.search(
    delimiter instanceof RegExp ? delimiter : delimiter,
  );

  if (index === -1) {
    return [input, ""];
  }

  const delimiterLength =
    delimiter instanceof RegExp
      ? input.match(delimiter)![0].length
      : delimiter.length;

  return [input.slice(0, index), input.slice(index + delimiterLength)];
}
