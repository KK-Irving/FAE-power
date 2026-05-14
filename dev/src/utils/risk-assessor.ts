/**
 * Risk Assessor utility module.
 *
 * Evaluates problem reports against 7 risk factors and assigns a priority
 * level (P0-P4) based on standardized classification criteria.
 *
 * Classification rules:
 * - P0: Blocks shipping or mass production (reproduction rate 100% AND core function AND key account with time pressure ≤ 7 days)
 * - P1: Affects certification or customer acceptance (core function AND key account OR time pressure ≤ 14 days)
 * - P2: Has workaround available and does not block shipping or certification
 * - P3: Non-core function issue with reproduction rate less than 50%
 * - P4: Consultation or configuration question with no functional defect
 *
 * Workaround adjustment: Reduce by exactly one level (P1→P2, P2→P3, P3→P4)
 * UNLESS P0 due to blocking shipping/mass production.
 */

import type {
  ProblemReport,
  RiskAssessment,
  RiskLevel,
  EvaluatedFactors,
  SubsystemType,
} from '../types/index.js';

// =============================================================================
// Constants
// =============================================================================

/**
 * Core functions that are critical to device operation.
 * Issues in these subsystems are considered high-importance.
 */
const CORE_FUNCTION_SUBSYSTEMS: SubsystemType[] = [
  'boot-ota-recovery',
  'video-playback-mediacodec-drm',
  'wifi-bt-ethernet',
  'factory-mode-mass-production',
];

// =============================================================================
// Public API
// =============================================================================

/**
 * Evaluates all 7 risk factors from a problem report.
 *
 * Factors evaluated:
 * 1. Customer impact (key-account or standard)
 * 2. End-user scope (description of affected users/models)
 * 3. Reproduction rate (100%, >50%, <50%, not-reproducible)
 * 4. Function importance (core or non-core)
 * 5. Time pressure (days until deadline)
 * 6. Workaround availability (boolean)
 * 7. Historical issues (boolean)
 */
export function evaluateFactors(report: ProblemReport): EvaluatedFactors {
  const customerImpact = inferCustomerImpact(report.customerName);
  const endUserScope = inferEndUserScope(report);
  const reproductionRate = report.reproductionRate;
  const functionImportance = inferFunctionImportance(report.issueType);
  const timePressure = inferTimePressure(report);
  const workaroundAvailable = inferWorkaroundAvailable(report);
  const historicalIssues = inferHistoricalIssues(report);

  return {
    customerImpact,
    endUserScope,
    reproductionRate,
    functionImportance,
    timePressure,
    workaroundAvailable,
    historicalIssues,
  };
}

/**
 * Assigns exactly one risk level (P0-P4) based on the evaluated factors
 * and classification criteria.
 *
 * Classification logic (evaluated in priority order):
 * - P0: reproduction rate 100% AND core function AND key account with time pressure ≤ 7 days
 * - P1: core function AND (key account OR time pressure ≤ 14 days)
 * - P2: workaround available AND does not meet P0/P1 criteria
 * - P3: non-core function AND reproduction rate < 50%
 * - P4: consultation/configuration with no functional defect (not-reproducible AND non-core)
 */
export function classifyRiskLevel(factors: EvaluatedFactors): RiskLevel {
  // P0: Blocks shipping or mass production
  if (
    factors.reproductionRate === '100%' &&
    factors.functionImportance === 'core' &&
    factors.customerImpact === 'key-account' &&
    factors.timePressure <= 7
  ) {
    return 'P0';
  }

  // P1: Affects certification or customer acceptance
  if (
    factors.functionImportance === 'core' &&
    (factors.customerImpact === 'key-account' || factors.timePressure <= 14)
  ) {
    return 'P1';
  }

  // P2: Has workaround, doesn't block shipping/certification
  if (factors.workaroundAvailable) {
    return 'P2';
  }

  // P3: Non-core function, reproduction rate < 50%
  if (
    factors.functionImportance === 'non-core' &&
    (factors.reproductionRate === '<50%' || factors.reproductionRate === 'not-reproducible')
  ) {
    return 'P3';
  }

  // P4: Consultation/configuration, no functional defect
  if (
    factors.functionImportance === 'non-core' &&
    factors.reproductionRate === 'not-reproducible'
  ) {
    return 'P4';
  }

  // Default: if none of the specific criteria match, assign P2 as a middle ground
  // This covers cases like non-core with >50% reproduction and no workaround
  return 'P2';
}

/**
 * Applies workaround adjustment to the risk level.
 *
 * When a workaround is available, reduces the level by exactly one:
 * P1→P2, P2→P3, P3→P4.
 *
 * Exception: P0 remains P0 because it blocks shipping/mass production.
 * P4 remains P4 (cannot go lower).
 */
export function applyWorkaroundAdjustment(
  level: RiskLevel,
  workaroundAvailable: boolean
): RiskLevel {
  if (!workaroundAvailable) {
    return level;
  }

  // P0 shipping blocker exception: level stays P0
  if (level === 'P0') {
    return 'P0';
  }

  // Reduce by exactly one level
  const reductionMap: Record<RiskLevel, RiskLevel> = {
    'P0': 'P0', // never reached due to guard above
    'P1': 'P2',
    'P2': 'P3',
    'P3': 'P4',
    'P4': 'P4', // cannot go lower
  };

  return reductionMap[level];
}

/**
 * Generates a 1-3 sentence justification explaining which factors
 * were the primary drivers for the assigned risk level.
 */
export function generateJustification(
  factors: EvaluatedFactors,
  level: RiskLevel
): string {
  const sentences: string[] = [];

  switch (level) {
    case 'P0':
      sentences.push(
        `This issue blocks shipping or mass production with 100% reproduction rate on a core function for a key account.`
      );
      if (factors.timePressure <= 7) {
        sentences.push(
          `The deadline is within ${factors.timePressure} days, requiring immediate resolution.`
        );
      }
      break;

    case 'P1':
      sentences.push(
        `This issue affects certification or customer acceptance as it impacts a core function.`
      );
      if (factors.customerImpact === 'key-account') {
        sentences.push(`The affected customer is a key account requiring priority handling.`);
      } else if (factors.timePressure <= 14) {
        sentences.push(
          `Time pressure is critical with only ${factors.timePressure} days until deadline.`
        );
      }
      break;

    case 'P2':
      if (factors.workaroundAvailable) {
        sentences.push(
          `A workaround is available and the issue does not block shipping or certification.`
        );
      } else {
        sentences.push(
          `The issue does not meet P0 or P1 severity criteria but requires attention.`
        );
      }
      sentences.push(
        `Reproduction rate is ${factors.reproductionRate} on a ${factors.functionImportance} function.`
      );
      break;

    case 'P3':
      sentences.push(
        `This is a non-core function issue with reproduction rate ${factors.reproductionRate}.`
      );
      if (factors.historicalIssues) {
        sentences.push(`Similar issues have been reported previously.`);
      }
      break;

    case 'P4':
      sentences.push(
        `This is a consultation or configuration question with no functional defect identified.`
      );
      if (factors.functionImportance === 'non-core') {
        sentences.push(`The affected functionality is non-core.`);
      }
      break;
  }

  // Ensure at least one sentence is always present
  if (sentences.length === 0) {
    sentences.push(`Risk level ${level} assigned based on overall factor evaluation.`);
  }

  return sentences.join(' ');
}

/**
 * Main entry point: assesses risk for a problem report.
 *
 * Performs the full assessment pipeline:
 * 1. Evaluate all 7 risk factors
 * 2. Classify initial risk level (P0-P4)
 * 3. Apply workaround adjustment (reduce by 1 unless P0)
 * 4. Generate justification (1-3 sentences)
 * 5. Determine escalation requirement (P0/P1 require escalation)
 */
export function assessRisk(report: ProblemReport): RiskAssessment {
  const factors = evaluateFactors(report);
  const initialLevel = classifyRiskLevel(factors);
  const adjustedLevel = applyWorkaroundAdjustment(initialLevel, factors.workaroundAvailable);
  const justification = generateJustification(factors, adjustedLevel);
  const escalationRequired = adjustedLevel === 'P0' || adjustedLevel === 'P1';

  return {
    factors: {
      customerImpact: factors.customerImpact,
      endUserScope: factors.endUserScope,
      reproductionRate: factors.reproductionRate,
      functionImportance: factors.functionImportance,
      timePressure: factors.timePressure,
      workaroundAvailable: factors.workaroundAvailable,
      historicalIssues: factors.historicalIssues,
    },
    riskLevel: adjustedLevel,
    justification,
    escalationRequired,
  };
}

// =============================================================================
// Internal Helpers
// =============================================================================

/**
 * Infers customer impact level from the customer name.
 * Key accounts are identified by common large OEM/brand patterns.
 * In a production system this would query a customer database.
 */
function inferCustomerImpact(
  customerName: string
): 'key-account' | 'standard' {
  const keyAccountPatterns = [
    'samsung', 'lg', 'sony', 'tcl', 'hisense', 'xiaomi', 'philips',
    'sharp', 'toshiba', 'panasonic', 'vizio', 'skyworth', 'haier',
    'konka', 'changhong', 'oppo', 'realme',
  ];

  const lowerName = customerName.toLowerCase();
  for (const pattern of keyAccountPatterns) {
    if (lowerName.includes(pattern)) {
      return 'key-account';
    }
  }

  return 'standard';
}

/**
 * Infers end-user scope from the problem report description and context.
 */
function inferEndUserScope(report: ProblemReport): string {
  // Extract scope information from description if available
  const description = report.description.toLowerCase();

  if (description.includes('all') || description.includes('mass production')) {
    return `All devices of model ${report.productModel}`;
  }

  if (description.includes('batch') || description.includes('multiple')) {
    return `Multiple devices of model ${report.productModel}`;
  }

  return `Specific devices of model ${report.productModel}`;
}

/**
 * Determines function importance based on the subsystem type.
 * Core functions: boot, playback, network, upgrade (OTA).
 */
function inferFunctionImportance(
  issueType: SubsystemType
): 'core' | 'non-core' {
  if (CORE_FUNCTION_SUBSYSTEMS.includes(issueType)) {
    return 'core';
  }
  return 'non-core';
}

/**
 * Infers time pressure from the problem report.
 * Looks for deadline indicators in the description.
 * Defaults to 30 days if no deadline information is found.
 */
function inferTimePressure(report: ProblemReport): number {
  const description = report.description.toLowerCase();

  // Look for explicit day mentions
  const dayMatch = description.match(/(\d+)\s*days?\s*(left|remaining|until|deadline)/);
  if (dayMatch) {
    return parseInt(dayMatch[1], 10);
  }

  // Look for urgency keywords
  if (
    description.includes('urgent') ||
    description.includes('asap') ||
    description.includes('immediately') ||
    description.includes('shipping tomorrow')
  ) {
    return 1;
  }

  if (
    description.includes('this week') ||
    description.includes('shipping soon')
  ) {
    return 7;
  }

  if (
    description.includes('next week') ||
    description.includes('certification')
  ) {
    return 14;
  }

  // Default: no immediate time pressure
  return 30;
}

/**
 * Infers workaround availability from the problem report.
 * Checks description for workaround-related keywords.
 */
function inferWorkaroundAvailable(report: ProblemReport): boolean {
  const description = report.description.toLowerCase();

  return (
    description.includes('workaround') ||
    description.includes('temporary fix') ||
    description.includes('can be avoided') ||
    description.includes('alternative method')
  );
}

/**
 * Infers whether historical similar issues exist.
 * Checks description for history-related keywords.
 */
function inferHistoricalIssues(report: ProblemReport): boolean {
  const description = report.description.toLowerCase();

  return (
    description.includes('happened before') ||
    description.includes('recurring') ||
    description.includes('same issue') ||
    description.includes('similar problem') ||
    description.includes('regression')
  );
}
