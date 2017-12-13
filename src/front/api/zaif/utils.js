export const parseCurrencyPair = (currencyPair) => {
  const [base, quoted] = currencyPair.toLowerCase().split('_');
  return { base, quoted };
};
