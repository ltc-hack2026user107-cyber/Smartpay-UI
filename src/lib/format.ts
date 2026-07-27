export function formatGBP(amount: number): string {
  return `£${amount.toLocaleString("en-GB")}`;
}
