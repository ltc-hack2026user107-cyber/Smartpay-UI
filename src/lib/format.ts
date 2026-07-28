export function formatGBP(amount: number | null | undefined): string {
  if (typeof amount !== "number" || Number.isNaN(amount)) {
    return "£0";
  }

  return `£${amount.toLocaleString("en-GB")}`;
}
