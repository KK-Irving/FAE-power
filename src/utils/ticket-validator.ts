/**
 * Zmind ticket field validator and description generator.
 *
 * Validates that all required fields are present for ticket creation
 * and generates structured ticket descriptions from problem reports.
 */

import type {
  TicketCreationRequest,
  ValidationResult,
  ProblemReport,
  TicketDescription,
} from '../types/index.js';

/**
 * The 7 required fields for zmind ticket creation.
 */
const REQUIRED_FIELDS: (keyof TicketCreationRequest)[] = [
  'customerName',
  'module',
  'issueCategory',
  'description',
  'version',
  'reproductionSteps',
  'environmentDetails',
];

/**
 * Checks whether a field value is considered "missing".
 * A field is missing if it is undefined, null, empty string, or whitespace-only.
 */
function isFieldMissing(value: unknown): boolean {
  if (value === undefined || value === null) {
    return true;
  }
  if (typeof value === 'string') {
    return value.trim().length === 0;
  }
  return false;
}

/**
 * Validates that all 7 required fields in a TicketCreationRequest are present.
 *
 * A field is considered "missing" if it is empty, whitespace-only, or undefined.
 * Returns isValid = true only when ALL required fields are present.
 * Returns the list of missing field names in errors.
 *
 * Validates: Requirements 4.1, 4.2
 */
export function validateTicketFields(request: TicketCreationRequest): ValidationResult {
  const errors: string[] = [];

  for (const field of REQUIRED_FIELDS) {
    if (isFieldMissing(request[field])) {
      errors.push(field);
    }
  }

  return {
    isValid: errors.length === 0,
    errors,
  };
}

/**
 * Generates a structured TicketDescription from a ProblemReport.
 *
 * Maps ProblemReport fields to the 7 required TicketDescription sections:
 * - problemSummary: derived from description and issueType
 * - environment: derived from productModel, softwareVersion, and conditional fields
 * - reproductionSteps: from reproductionSteps with reproduction rate
 * - expectedBehavior: derived from description context
 * - actualBehavior: derived from description
 * - logsCollected: from logs array
 * - initialAnalysis: derived from issueType and available context
 *
 * Validates: Requirements 4.4
 */
export function generateTicketDescription(report: ProblemReport): TicketDescription {
  const environmentParts = [
    `Product Model: ${report.productModel}`,
    `Software Version: ${report.softwareVersion}`,
  ];

  if (report.networkEnvironment) {
    environmentParts.push(`Network Environment: ${report.networkEnvironment}`);
  }
  if (report.videoSource) {
    environmentParts.push(`Video Source: ${report.videoSource}`);
  }
  if (report.appVersion) {
    environmentParts.push(`App Version: ${report.appVersion}`);
  }

  const reproductionWithRate = `${report.reproductionSteps}\nReproduction Rate: ${report.reproductionRate}`;

  const problemSummary = `[${report.issueType}] ${report.description} (Customer: ${report.customerName})`;

  const actualBehavior = report.description;

  const expectedBehavior = `The ${report.issueType} functionality should work as expected without the reported issue.`;

  const initialAnalysis = report.comparisonInfo
    ? `Issue categorized under ${report.issueType} subsystem. Comparison info: ${report.comparisonInfo}. Further investigation required.`
    : `Issue categorized under ${report.issueType} subsystem. Further investigation required.`;

  return {
    problemSummary,
    environment: environmentParts.join('\n'),
    reproductionSteps: reproductionWithRate,
    expectedBehavior,
    actualBehavior,
    logsCollected: report.logs,
    initialAnalysis,
  };
}
