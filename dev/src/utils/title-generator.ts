/**
 * Zmind ticket title generator.
 *
 * Generates titles in the format: [Customer][AndroidTV][Module][Issue] Description on Version
 * Maximum length: 200 characters. If truncation is needed, only the Description portion is truncated.
 */

const MAX_TITLE_LENGTH = 200;
const TRUNCATION_SUFFIX = '...';

/**
 * Generates a zmind ticket title following the standard format.
 *
 * Format: [Customer][AndroidTV][Module][Issue] Description on Version
 *
 * Rules:
 * - Maximum total length is 200 characters
 * - If the total exceeds 200 characters, only the Description portion is truncated
 * - Truncated descriptions end with "..."
 * - All other parts (customer, module, issue, version) are preserved intact
 *
 * @param customer - Customer name
 * @param module - Module/subsystem name
 * @param issue - Issue category
 * @param description - Problem description (this is the only part that may be truncated)
 * @param version - Software version
 * @returns Formatted title string, at most 200 characters
 */
export function generateTitle(
  customer: string,
  module: string,
  issue: string,
  description: string,
  version: string
): string {
  // Build the fixed parts of the title (everything except description)
  const prefix = `[${customer}][AndroidTV][${module}][${issue}] `;
  const suffix = ` on ${version}`;

  // Calculate available space for description
  const fixedLength = prefix.length + suffix.length;
  const availableForDescription = MAX_TITLE_LENGTH - fixedLength;

  // Determine the description to use
  let finalDescription: string;

  if (availableForDescription <= 0) {
    // No space for description at all — use empty description
    finalDescription = '';
  } else if (description.length <= availableForDescription) {
    // Description fits without truncation
    finalDescription = description;
  } else {
    // Need to truncate description
    const truncatedLength = availableForDescription - TRUNCATION_SUFFIX.length;
    if (truncatedLength <= 0) {
      // Not enough space even for "..." — just use what fits
      finalDescription = description.slice(0, availableForDescription);
    } else {
      finalDescription = description.slice(0, truncatedLength) + TRUNCATION_SUFFIX;
    }
  }

  return `${prefix}${finalDescription}${suffix}`;
}
