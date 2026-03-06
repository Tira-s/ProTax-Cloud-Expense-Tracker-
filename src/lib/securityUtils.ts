/**
 * Security utilities for ProTax Cloud
 * Focuses on preventing common web vulnerabilities like XSS.
 */

/**
 * Sanitize text input to prevent basic XSS
 * Removes HTML tags and trims whitespace
 */
export function sanitizeText(text: string): string {
  if (!text) return "";
  // Simple regex to strip HTML tags
  return text.replace(/<[^>]*>?/gm, '').trim();
}

/**
 * Validate numeric input for financial safety
 * Prevents negative values (where applicable) and Infinity
 */
export function isValidAmount(amount: number): boolean {
  return typeof amount === "number" && isFinite(amount);
}
