export function hideRechartsConsoleError() {
  const error = console.error;
  return (console.error = (...args: any) => {
    if (/defaultProps/.test(args[0])) return;
    error(...args);
  });
}
