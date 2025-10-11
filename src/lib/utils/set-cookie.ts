export function setCookie({
  name,
  value,
  path,
}: {
  name: string;
  value: string;
  path: string;
}) {
  document.cookie = `${name}=${value};path=${path}`;
}
