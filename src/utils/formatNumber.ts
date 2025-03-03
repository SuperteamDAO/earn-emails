export const formatNumber = (number: number) =>
  new Intl.NumberFormat('en-US', { maximumSignificantDigits: 3 }).format(
    number,
  );
