/**
 * Profitability calculator (plan.md "Profitability Calculator"). Pure, stateless
 * farm economics — guests run it freely. All money is in LKR; quantities in kg.
 *
 * Inputs are per the whole plot (already multiplied by area). Either provide
 * `marketPricePerKg` directly, or the route resolves it from the latest recorded
 * price for a crop+district.
 */
export interface ProfitabilityInput {
  totalCost: number;
  expectedYieldKg: number;
  marketPricePerKg: number;
}

export interface ProfitabilityResult {
  currency: "LKR";
  totalCost: number;
  expectedYieldKg: number;
  marketPricePerKg: number;
  revenue: number;
  profit: number;
  /** Profit as a percent of revenue (null when revenue is 0). */
  marginPercent: number | null;
  /** Price per kg at which revenue equals cost (null when yield is 0). */
  breakEvenPricePerKg: number | null;
  /** Yield in kg at which revenue equals cost (null when price is 0). */
  breakEvenYieldKg: number | null;
  profitable: boolean;
}

const round2 = (n: number) => Math.round(n * 100) / 100;

export function computeProfitability(input: ProfitabilityInput): ProfitabilityResult {
  const { totalCost, expectedYieldKg, marketPricePerKg } = input;
  const revenue = expectedYieldKg * marketPricePerKg;
  const profit = revenue - totalCost;

  return {
    currency: "LKR",
    totalCost: round2(totalCost),
    expectedYieldKg: round2(expectedYieldKg),
    marketPricePerKg: round2(marketPricePerKg),
    revenue: round2(revenue),
    profit: round2(profit),
    marginPercent: revenue > 0 ? round2((profit / revenue) * 100) : null,
    breakEvenPricePerKg: expectedYieldKg > 0 ? round2(totalCost / expectedYieldKg) : null,
    breakEvenYieldKg: marketPricePerKg > 0 ? round2(totalCost / marketPricePerKg) : null,
    profitable: profit >= 0,
  };
}
