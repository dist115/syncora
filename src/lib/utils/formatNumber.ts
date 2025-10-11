/**
 * Formats a number to a string representation with support for million (M) and billion (B) abbreviations.
 * @param {number} value - The number to be formatted.
 * @returns {string} - The formatted string.
 */
export function formatNumber(value: number): string {
  if (value < 0) {
    const absoluteValue = Math.abs(value);
    return `-${formatNumber(absoluteValue)}`;
  } else if (value >= 1e9) {
    const formattedValue = value / 1e9;
    return `${formattedValue.toFixed(1)}B`;
  } else if (value >= 1e6) {
    const formattedValue = value / 1e6;
    return `${formattedValue.toFixed(1)}M`;
  } else if (value >= 1000) {
    const formattedValue = value / 1000;
    return `${formattedValue.toFixed(1)}K`;
  } else {
    return value.toString();
  }
}
