/**
 * Completeness Checker Utility Module
 *
 * Validates whether a ProblemReport contains all required information
 * based on mandatory fields and conditional fields relevant to the issue type.
 * Calculates a completeness score as a percentage.
 *
 * Validates: Requirements 2.1, 2.2, 2.3, 2.5
 */

import type {
  ProblemReport,
  SubsystemType,
  MissingField,
  CompletenessResult,
} from '../types/index.js';

// =============================================================================
// Field Definitions
// =============================================================================

/**
 * Describes a field that can be checked for presence in a ProblemReport.
 */
export interface Field {
  name: string;
  key: keyof ProblemReport;
  type: 'mandatory' | 'conditional';
  reason: string;
}

/**
 * Mandatory fields that are always required regardless of issue type.
 */
const MANDATORY_FIELDS: Field[] = [
  {
    name: 'Product Model',
    key: 'productModel',
    type: 'mandatory',
    reason: 'Required to identify the specific hardware and its capabilities',
  },
  {
    name: 'Software Version',
    key: 'softwareVersion',
    type: 'mandatory',
    reason: 'Required to identify the firmware build and check for known issues',
  },
  {
    name: 'Reproduction Steps',
    key: 'reproductionSteps',
    type: 'mandatory',
    reason: 'Required to reproduce the issue locally for diagnosis',
  },
  {
    name: 'Reproduction Rate',
    key: 'reproductionRate',
    type: 'mandatory',
    reason: 'Required to assess issue severity and prioritize investigation',
  },
  {
    name: 'Logs',
    key: 'logs',
    type: 'mandatory',
    reason: 'Required to analyze system behavior at the time of the issue',
  },
];

/**
 * Conditional fields with their applicable subsystem types.
 */
interface ConditionalFieldDef extends Field {
  applicableSubsystems: SubsystemType[];
}

const CONDITIONAL_FIELDS: ConditionalFieldDef[] = [
  {
    name: 'Network Environment',
    key: 'networkEnvironment',
    type: 'conditional',
    reason: 'Required for network-related issues to understand connectivity context',
    applicableSubsystems: ['wifi-bt-ethernet'],
  },
  {
    name: 'Video Source',
    key: 'videoSource',
    type: 'conditional',
    reason: 'Required for playback issues to identify the content source and format',
    applicableSubsystems: ['video-playback-mediacodec-drm'],
  },
  {
    name: 'App Version',
    key: 'appVersion',
    type: 'conditional',
    reason: 'Required for app-specific issues to check compatibility and known bugs',
    applicableSubsystems: ['app-compatibility'],
  },
  {
    name: 'Comparison Info',
    key: 'comparisonInfo',
    type: 'conditional',
    reason: 'Required for regression issues to identify what changed between versions',
    // Regression issues can occur in any subsystem, but comparison info is
    // specifically relevant when the issue involves OTA/recovery (version changes)
    // or performance regressions. We map it to subsystems most commonly associated
    // with regression analysis.
    applicableSubsystems: ['boot-ota-recovery'],
  },
];

// =============================================================================
// Placeholder Detection
// =============================================================================

/**
 * Patterns that indicate a field value is a placeholder rather than meaningful content.
 * A field is considered absent if its value matches any of these patterns.
 */
const PLACEHOLDER_PATTERNS: RegExp[] = [
  /^\s*$/,           // whitespace-only
  /^n\/?a$/i,       // "N/A", "n/a", "N/a"
  /^tbd$/i,         // "TBD", "tbd"
  /^todo$/i,        // "TODO", "todo"
  /^none$/i,        // "none", "None"
  /^unknown$/i,     // "unknown", "Unknown"
  /^-+$/,           // dashes only "---"
  /^\.{2,}$/,       // dots only "..."
  /^\?+$/,          // question marks only "???"
];

/**
 * Determines whether a string value contains meaningful content.
 * Returns false for empty strings, whitespace-only, or placeholder values.
 */
function hasMeaningfulContent(value: string): boolean {
  if (!value || value.trim().length === 0) {
    return false;
  }
  const trimmed = value.trim();
  return !PLACEHOLDER_PATTERNS.some((pattern) => pattern.test(trimmed));
}

/**
 * Determines whether a field value in a ProblemReport is meaningfully present.
 * Handles string fields and the logs array field.
 */
function isFieldPresent(report: ProblemReport, key: keyof ProblemReport): boolean {
  const value = report[key];

  if (value === undefined || value === null) {
    return false;
  }

  // Handle the logs field (string array)
  if (key === 'logs') {
    const logs = value as string[];
    if (!Array.isArray(logs) || logs.length === 0) {
      return false;
    }
    // At least one log entry must have meaningful content
    return logs.some((log) => hasMeaningfulContent(log));
  }

  // Handle string fields
  if (typeof value === 'string') {
    return hasMeaningfulContent(value);
  }

  // For any other type (e.g., reproductionRate which is a union type string),
  // treat as present if it's a non-empty string
  return true;
}

// =============================================================================
// Public API
// =============================================================================

/**
 * Returns the list of applicable fields for a given issue type.
 * Applicable fields = all mandatory fields + conditional fields relevant to the issue type.
 */
export function getApplicableFields(issueType: SubsystemType): Field[] {
  const applicableConditional = CONDITIONAL_FIELDS.filter((field) =>
    field.applicableSubsystems.includes(issueType)
  );

  return [...MANDATORY_FIELDS, ...applicableConditional];
}

/**
 * Evaluates which fields are present and which are missing in a ProblemReport.
 * A field is "present" if it contains at least one meaningful descriptive token
 * beyond empty or placeholder values.
 */
export function evaluateFieldPresence(report: ProblemReport): {
  present: string[];
  missing: MissingField[];
} {
  const applicableFields = getApplicableFields(report.issueType);
  const present: string[] = [];
  const missing: MissingField[] = [];

  for (const field of applicableFields) {
    if (isFieldPresent(report, field.key)) {
      present.push(field.name);
    } else {
      missing.push({
        fieldName: field.name,
        fieldType: field.type,
        reason: field.reason,
      });
    }
  }

  return { present, missing };
}

/**
 * Calculates the completeness score for a ProblemReport.
 * Score = round((presentApplicableFields / totalApplicableFields) × 100)
 */
export function calculateCompletenessScore(report: ProblemReport): number {
  const applicableFields = getApplicableFields(report.issueType);
  const totalApplicableFields = applicableFields.length;

  if (totalApplicableFields === 0) {
    return 100;
  }

  let presentCount = 0;
  for (const field of applicableFields) {
    if (isFieldPresent(report, field.key)) {
      presentCount++;
    }
  }

  return Math.round((presentCount / totalApplicableFields) * 100);
}

/**
 * Main entry point: performs a full completeness check on a ProblemReport.
 * Combines field identification, presence evaluation, and score calculation.
 */
export function checkCompleteness(report: ProblemReport): CompletenessResult {
  const applicableFields = getApplicableFields(report.issueType);
  const { present, missing } = evaluateFieldPresence(report);
  const score = calculateCompletenessScore(report);

  return {
    isComplete: missing.length === 0,
    score,
    presentFields: present,
    missingFields: missing,
    totalApplicableFields: applicableFields.length,
  };
}
