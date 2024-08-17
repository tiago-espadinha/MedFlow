export const formatCurrency = (v: number): string =>
  `${v.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}€`;
