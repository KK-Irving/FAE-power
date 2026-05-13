/**
 * Response structure validation for FAE Skill outputs.
 *
 * Validates that generated responses conform to the required structure
 * defined in the design document, including bilingual outputs, communication
 * sections, technical Q&A responses, log recommendations, and knowledge entries.
 *
 * All validators return a ValidationResult with isValid and an errors array.
 */

import type {
  CommunicationOutput,
  CommunicationType,
  KnowledgeEntry,
  KnowledgeSearchResult,
  LogRecommendation,
  TechnicalQAResponse,
  ValidationResult,
} from '../types/index.js';

// =============================================================================
// Communication Output Validators
// =============================================================================

/**
 * Validates that a bilingual communication output contains both Chinese and
 * English sections with non-empty content.
 *
 * Validates: Requirements 2.4, 5.1
 */
export function validateBilingualOutput(output: CommunicationOutput): ValidationResult {
  const errors: string[] = [];

  if (!output.chinese || typeof output.chinese !== 'string' || output.chinese.trim().length === 0) {
    errors.push('Chinese section is missing or empty');
  }

  if (!output.english || typeof output.english !== 'string' || output.english.trim().length === 0) {
    errors.push('English section is missing or empty');
  }

  return { isValid: errors.length === 0, errors };
}

/**
 * Required sections for each communication type.
 */
const COMMUNICATION_SECTIONS: Record<CommunicationType, string[]> = {
  'progress-update': ['status', 'actions taken', 'next steps', 'timeline'],
  'risk-notification': ['risk description', 'impact scope', 'mitigation', 'recommended actions'],
  'problem-clarification': ['summary', 'info needed', 'reason', 'next steps'],
  'version-delivery': ['version id', 'changes', 'limitations', 'verification steps'],
  'delay-explanation': ['original timeline', 'reason', 'revised timeline', 'actions'],
  'escalation-handling': ['acknowledgment', 'current status', 'action plan', 'timeline'],
};

/**
 * Validates that a communication output contains all required sections for
 * the given communication type, in both Chinese and English.
 *
 * Validates: Requirements 5.3, 5.4, 5.5, 5.6, 5.7
 */
export function validateCommunicationSections(
  type: CommunicationType,
  output: CommunicationOutput,
): ValidationResult {
  const errors: string[] = [];

  // First validate bilingual structure
  const bilingualResult = validateBilingualOutput(output);
  if (!bilingualResult.isValid) {
    return bilingualResult;
  }

  const requiredSections = COMMUNICATION_SECTIONS[type];
  if (!requiredSections) {
    errors.push(`Unknown communication type: ${type}`);
    return { isValid: false, errors };
  }

  const chineseLower = output.chinese.toLowerCase();
  const englishLower = output.english.toLowerCase();

  for (const section of requiredSections) {
    if (!chineseLower.includes(section) && !englishLower.includes(section)) {
      errors.push(`Missing required section "${section}" for type "${type}"`);
    }
  }

  return { isValid: errors.length === 0, errors };
}

// =============================================================================
// Technical Q&A Validators
// =============================================================================

/**
 * Validates that a Technical Q&A response contains all required sections:
 * - possibleCauses: 1-5 items, each with a likelihood level
 * - troubleshootingPath: non-empty array of ordered steps
 * - informationNeeded: non-empty array
 * - logsToCollect: each with a command
 * - nextSteps: non-empty array
 * - escalationRecommendation: 'escalate' or 'not-required'
 * - massProductionImpact: 'yes', 'no', or 'unknown'
 *
 * Validates: Requirements 1.1
 */
export function validateTechnicalQAResponse(response: TechnicalQAResponse): ValidationResult {
  const errors: string[] = [];

  // Validate possibleCauses: 1-5 items each with likelihood
  if (!response.possibleCauses || !Array.isArray(response.possibleCauses)) {
    errors.push('possibleCauses is missing or not an array');
  } else {
    if (response.possibleCauses.length < 1) {
      errors.push('possibleCauses must have at least 1 item');
    }
    if (response.possibleCauses.length > 5) {
      errors.push('possibleCauses must have at most 5 items');
    }
    for (let i = 0; i < response.possibleCauses.length; i++) {
      const cause = response.possibleCauses[i];
      if (!cause.description || cause.description.trim().length === 0) {
        errors.push(`possibleCauses[${i}] has empty description`);
      }
      if (!['high', 'medium', 'low'].includes(cause.likelihood)) {
        errors.push(`possibleCauses[${i}] has invalid likelihood: ${cause.likelihood}`);
      }
    }
  }

  // Validate troubleshootingPath: non-empty
  if (!response.troubleshootingPath || !Array.isArray(response.troubleshootingPath)) {
    errors.push('troubleshootingPath is missing or not an array');
  } else if (response.troubleshootingPath.length === 0) {
    errors.push('troubleshootingPath must have at least 1 step');
  }

  // Validate informationNeeded: non-empty
  if (!response.informationNeeded || !Array.isArray(response.informationNeeded)) {
    errors.push('informationNeeded is missing or not an array');
  } else if (response.informationNeeded.length === 0) {
    errors.push('informationNeeded must have at least 1 item');
  }

  // Validate logsToCollect: each with command
  if (!response.logsToCollect || !Array.isArray(response.logsToCollect)) {
    errors.push('logsToCollect is missing or not an array');
  } else {
    for (let i = 0; i < response.logsToCollect.length; i++) {
      const logResult = validateLogRecommendation(response.logsToCollect[i]);
      if (!logResult.isValid) {
        errors.push(...logResult.errors.map((e) => `logsToCollect[${i}]: ${e}`));
      }
    }
  }

  // Validate nextSteps: non-empty
  if (!response.nextSteps || !Array.isArray(response.nextSteps)) {
    errors.push('nextSteps is missing or not an array');
  } else if (response.nextSteps.length === 0) {
    errors.push('nextSteps must have at least 1 item');
  }

  // Validate escalationRecommendation
  if (!['escalate', 'not-required'].includes(response.escalationRecommendation)) {
    errors.push(
      `escalationRecommendation must be "escalate" or "not-required", got: ${response.escalationRecommendation}`,
    );
  }

  // Validate massProductionImpact
  if (!['yes', 'no', 'unknown'].includes(response.massProductionImpact)) {
    errors.push(
      `massProductionImpact must be "yes", "no", or "unknown", got: ${response.massProductionImpact}`,
    );
  }

  return { isValid: errors.length === 0, errors };
}

/**
 * Validates low confidence escalation requirements.
 * When confidence is medium or low, the response must have:
 * - escalationRecommendation set to 'escalate'
 * - rdQuestions array with at least 1 item
 *
 * If confidence is high, validation always passes (no additional requirements).
 *
 * Validates: Requirements 1.3
 */
export function validateLowConfidenceEscalation(
  response: TechnicalQAResponse,
): ValidationResult {
  const errors: string[] = [];

  // Only apply low-confidence rules when confidence is medium or low
  if (response.confidence === 'medium' || response.confidence === 'low') {
    if (response.escalationRecommendation !== 'escalate') {
      errors.push(
        `When confidence is ${response.confidence}, escalationRecommendation must be "escalate"`,
      );
    }

    if (!response.rdQuestions || !Array.isArray(response.rdQuestions) || response.rdQuestions.length < 1) {
      errors.push(
        `When confidence is ${response.confidence}, rdQuestions must contain at least 1 item`,
      );
    }
  }

  return { isValid: errors.length === 0, errors };
}

// =============================================================================
// Log Recommendation Validator
// =============================================================================

/**
 * Validates that a log recommendation has a non-empty ADB command.
 *
 * Validates: Requirements 3.9
 */
export function validateLogRecommendation(recommendation: LogRecommendation): ValidationResult {
  const errors: string[] = [];

  if (!recommendation.command || typeof recommendation.command !== 'string' || recommendation.command.trim().length === 0) {
    errors.push('Log recommendation must have a non-empty command');
  }

  return { isValid: errors.length === 0, errors };
}

// =============================================================================
// Knowledge Base Validators
// =============================================================================

/**
 * Validates that a knowledge entry contains all 8 required fields:
 * problemName, background, rootCause, solution, impactScope,
 * preventionMeasures, lessonsLearned, and metadata (with subsystem, customer, resolvedDate).
 *
 * Validates: Requirements 8.1
 */
export function validateKnowledgeEntry(entry: KnowledgeEntry): ValidationResult {
  const errors: string[] = [];

  // Validate 7 top-level required string fields
  const requiredStringFields: (keyof KnowledgeEntry)[] = [
    'problemName',
    'background',
    'rootCause',
    'solution',
    'impactScope',
    'preventionMeasures',
    'lessonsLearned',
  ];

  for (const field of requiredStringFields) {
    const value = entry[field];
    if (!value || typeof value !== 'string' || (value as string).trim().length === 0) {
      errors.push(`Knowledge entry field "${field}" is missing or empty`);
    }
  }

  // Validate metadata (8th required field group)
  if (!entry.metadata) {
    errors.push('Knowledge entry metadata is missing');
  } else {
    if (!entry.metadata.subsystem || typeof entry.metadata.subsystem !== 'string' || entry.metadata.subsystem.trim().length === 0) {
      errors.push('Knowledge entry metadata.subsystem is missing or empty');
    }
    if (!entry.metadata.customer || typeof entry.metadata.customer !== 'string' || entry.metadata.customer.trim().length === 0) {
      errors.push('Knowledge entry metadata.customer is missing or empty');
    }
    if (!entry.metadata.resolvedDate || typeof entry.metadata.resolvedDate !== 'string' || entry.metadata.resolvedDate.trim().length === 0) {
      errors.push('Knowledge entry metadata.resolvedDate is missing or empty');
    }
  }

  return { isValid: errors.length === 0, errors };
}

/**
 * Validates knowledge search results:
 * - Maximum 5 results
 * - Each result has a non-empty summary
 * - Each result has a valid applicability assessment
 *
 * Validates: Requirements 8.3
 */
export function validateKnowledgeSearchResults(
  results: KnowledgeSearchResult[],
): ValidationResult {
  const errors: string[] = [];

  if (!Array.isArray(results)) {
    errors.push('Knowledge search results must be an array');
    return { isValid: false, errors };
  }

  if (results.length > 5) {
    errors.push(`Knowledge search results must have at most 5 items, got ${results.length}`);
  }

  const validApplicabilities = ['directly-applies', 'partially-applies', 'does-not-apply'];

  for (let i = 0; i < results.length; i++) {
    const result = results[i];

    if (!result.summary || typeof result.summary !== 'string' || result.summary.trim().length === 0) {
      errors.push(`Knowledge search result[${i}] has missing or empty summary`);
    }

    if (!validApplicabilities.includes(result.applicability)) {
      errors.push(
        `Knowledge search result[${i}] has invalid applicability: ${result.applicability}`,
      );
    }
  }

  return { isValid: errors.length === 0, errors };
}
