export function formatINR(amount: number): string {
  const rounded = Math.round(amount * 100) / 100;
  return `₹${rounded.toLocaleString("en-IN", {
    minimumFractionDigits: Number.isInteger(rounded) ? 0 : 2,
    maximumFractionDigits: 2,
  })}`;
}
