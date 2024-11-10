export default function minByFn<T>(
  arr: T[],
  fn: (value: T, index: number, arr: T[]) => number,
): T {
  const min = arr.reduce(
    (closest, curr, i, arr) => {
      const currResult = fn(curr, i, arr);
      return currResult < closest.result
        ? { value: curr, result: currResult }
        : closest;
    },
    { value: arr[0], result: fn(arr[0], 0, arr) },
  );

  return min.value;
}
