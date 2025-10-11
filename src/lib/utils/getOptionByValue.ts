export function getOptionByValue(options: any[], value: string | number) {
  return options?.find(
    (op) => op.value.toString().toLowerCase() === value.toString().toLowerCase()
  );
}
