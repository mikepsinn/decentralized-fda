/**
 * Formatting utilities for displaying calculation results
 */

export class FormatUtils {
  /**
   * Format a number as currency
   */
  public static formatCurrency(
    value: number,
    options: { abbreviate?: boolean } = {},
  ): string {
    const { abbreviate = false } = options;

    if (abbreviate) {
      if (Math.abs(value) >= 1e9) {
        return `$${(value / 1e9).toFixed(1)}B`;
      }
      if (Math.abs(value) >= 1e6) {
        return `$${(value / 1e6).toFixed(1)}M`;
      }
      if (Math.abs(value) >= 1e3) {
        return `$${(value / 1e3).toFixed(1)}K`;
      }
    }

    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(value);
  }

  /**
   * Format a number as a percentage
   */
  public static formatPercentage(value: number, decimals = 1): string {
    return `${value.toFixed(decimals)}%`;
  }

  /**
   * Format a number with appropriate units
   */
  public static formatWithUnits(value: number, unit?: string): string {
    const formatted = value.toLocaleString("en-US", {
      maximumFractionDigits: 2,
    });

    return unit ? `${formatted} ${unit}` : formatted;
  }

  /**
   * Format a confidence interval
   */
  public static formatConfidenceInterval(
    value: number,
    lower: number,
    upper: number,
    unit?: string,
  ): string {
    const formatted = this.formatWithUnits(value, unit);
    const lowerFormatted = this.formatWithUnits(lower, unit);
    const upperFormatted = this.formatWithUnits(upper, unit);

    return `${formatted} (95% CI: ${lowerFormatted} to ${upperFormatted})`;
  }

  /**
   * Format a relative change
   */
  public static formatChange(
    value: number,
    options: { showSign?: boolean; asPercentage?: boolean } = {},
  ): string {
    const { showSign = true, asPercentage = false } = options;

    let formatted = Math.abs(value).toFixed(1);
    if (asPercentage) {
      formatted += "%";
    }

    if (showSign) {
      return value >= 0 ? `+${formatted}` : `-${formatted}`;
    }

    return formatted;
  }

  /**
   * Format a time period in years
   */
  public static formatYears(years: number): string {
    if (years === Infinity) {
      return "Never";
    }

    if (years < 1) {
      const months = Math.round(years * 12);
      return `${months} month${months === 1 ? "" : "s"}`;
    }

    const wholeYears = Math.floor(years);
    const months = Math.round((years - wholeYears) * 12);

    if (months === 0) {
      return `${wholeYears} year${wholeYears === 1 ? "" : "s"}`;
    }

    return `${wholeYears} year${wholeYears === 1 ? "" : "s"} and ${months} month${months === 1 ? "" : "s"}`;
  }

  /**
   * Format a cost-effectiveness ratio
   */
  public static formatICER(value: number): string {
    if (value === Infinity) {
      return "Dominated (more costly, less effective)";
    }
    if (value === -Infinity) {
      return "Dominant (less costly, more effective)";
    }
    return `${this.formatCurrency(value)}/QALY`;
  }
}
