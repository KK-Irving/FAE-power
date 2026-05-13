/**
 * Core type definitions for the FAE Skill system.
 *
 * Defines all data model interfaces and union types used across
 * utility modules for completeness checking, risk assessment,
 * ticket management, workflow orchestration, and response validation.
 */

// =============================================================================
// Union Types
// =============================================================================

/**
 * 13 supported Android TV subsystems.
 * Used for routing technical questions and categorizing issues.
 */
export type SubsystemType =
  | 'boot-ota-recovery'
  | 'launcher-settings-gms'
  | 'wifi-bt-ethernet'
  | 'hdmi-cec-hdcp-arc'
  | 'display-pq-hdr-dolby-vision'
  | 'audio-dolby-dts'
  | 'video-playback-mediacodec-drm'
  | 'remote-control-ir-bt'
  | 'app-compatibility'
  | 'performance-anr-crash'
  | 'standby-wake'
  | 'factory-mode-mass-production'
  | 'customer-customization';

/**
 * 9 zmind ticket statuses representing the issue lifecycle.
 */
export type TicketStatus =
  | 'new'
  | 'info-pending'
  | 'reproducing'
  | 'rd-analyzing'
  | 'workaround-provided'
  | 'fix-released'
  | 'customer-verifying'
  | 'suspended'
  | 'closed';

/**
 * 12 workflow stages in the standard FAE workflow sequence.
 */
export type WorkflowStage =
  | 'completeness-check'
  | 'risk-assessment'
  | 'log-collection'
  | 'knowledge-query'
  | 'local-reproduction'
  | 'zmind-ticket-creation'
  | 'rd-analysis-tracking'
  | 'progress-communication'
  | 'fix-verification'
  | 'customer-confirmation'
  | 'closure'
  | 'post-mortem';

/**
 * 6 supported customer communication types.
 */
export type CommunicationType =
  | 'problem-clarification'
  | 'progress-update'
  | 'risk-notification'
  | 'version-delivery'
  | 'delay-explanation'
  | 'escalation-handling';

/**
 * Risk priority levels from P0 (most critical) to P4 (least critical).
 * P0: Blocks shipping or mass production
 * P1: Affects certification or customer acceptance
 * P2: Has workaround, doesn't block shipping/certification
 * P3: Non-core function, reproduction rate < 50%
 * P4: Consultation/configuration, no functional defect
 */
export type RiskLevel = 'P0' | 'P1' | 'P2' | 'P3' | 'P4';

/**
 * Reproduction rate categories for problem reports.
 */
export type ReproductionRate = '100%' | '>50%' | '<50%' | 'not-reproducible';

/**
 * Confidence level for technical Q&A responses.
 */
export type ConfidenceLevel = 'high' | 'medium' | 'low';

/**
 * Likelihood level for possible causes in diagnostic analysis.
 */
export type LikelihoodLevel = 'high' | 'medium' | 'low';

// =============================================================================
// Core Data Model Interfaces
// =============================================================================

/**
 * A structured customer problem report containing mandatory and conditional fields.
 * Conditional fields are required based on the issue type.
 */
export interface ProblemReport {
  // Mandatory fields
  productModel: string;
  softwareVersion: string;
  reproductionSteps: string;
  reproductionRate: ReproductionRate;
  logs: string[];

  // Conditional fields
  networkEnvironment?: string;   // Required for network issues
  videoSource?: string;          // Required for playback issues
  appVersion?: string;           // Required for app-specific issues
  comparisonInfo?: string;       // Required for regression issues

  // Context
  customerName: string;
  issueType: SubsystemType;
  description: string;
}

/**
 * Risk assessment output including factor evaluation, classification, and justification.
 */
export interface RiskAssessment {
  factors: {
    customerImpact: 'key-account' | 'standard';
    endUserScope: string;
    reproductionRate: ReproductionRate;
    functionImportance: 'core' | 'non-core';
    timePressure: number;          // days until deadline
    workaroundAvailable: boolean;
    historicalIssues: boolean;
  };
  riskLevel: RiskLevel;
  justification: string;           // 1-3 sentences
  workaroundDescription?: string;
  escalationRequired: boolean;
}

/**
 * A zmind issue ticket with structured title, description, metadata, and status.
 */
export interface ZmindTicket {
  title: string;                   // Max 200 chars
  description: TicketDescription;
  metadata: {
    customer: string;
    module: SubsystemType;
    category: string;
    version: string;
    priority: RiskLevel;
  };
  status: TicketStatus;
}

/**
 * Structured ticket description with 7 required sections.
 */
export interface TicketDescription {
  problemSummary: string;
  environment: string;
  reproductionSteps: string;
  expectedBehavior: string;
  actualBehavior: string;
  logsCollected: string[];
  initialAnalysis: string;
}

/**
 * Workflow state tracking progress through the 12-stage FAE workflow.
 */
export interface WorkflowState {
  issueDescription: string;
  currentStage: WorkflowStage;
  completedStages: WorkflowStage[];
  skippedStages: { stage: WorkflowStage; timestamp: string }[];
}

/**
 * A knowledge base entry generated from a resolved issue.
 * Contains all 8 required fields for team knowledge accumulation.
 */
export interface KnowledgeEntry {
  problemName: string;
  background: string;
  rootCause: string;
  solution: string;
  workaround?: string;
  impactScope: string;
  preventionMeasures: string;
  lessonsLearned: string;
  metadata: {
    subsystem: SubsystemType;
    customer: string;
    resolvedDate: string;
    zmindTicketId?: string;
  };
}

/**
 * Input for the communication generator specifying type and context.
 */
export interface CommunicationRequest {
  type: CommunicationType;
  context: Record<string, string>;
}

/**
 * Bilingual communication output with Chinese and English sections.
 */
export interface CommunicationOutput {
  chinese: string;
  english: string;
}

// =============================================================================
// Helper Types — Completeness Checker
// =============================================================================

/**
 * Describes a missing field identified by the completeness checker.
 */
export interface MissingField {
  fieldName: string;
  fieldType: 'mandatory' | 'conditional';
  reason: string;
}

/**
 * Result of a completeness check on a problem report.
 */
export interface CompletenessResult {
  isComplete: boolean;
  score: number;                   // 0-100 percentage
  presentFields: string[];
  missingFields: MissingField[];
  totalApplicableFields: number;
}

// =============================================================================
// Helper Types — Risk Assessor
// =============================================================================

/**
 * Evaluated risk factors with scored values for priority classification.
 */
export interface EvaluatedFactors {
  customerImpact: 'key-account' | 'standard';
  endUserScope: string;
  reproductionRate: ReproductionRate;
  functionImportance: 'core' | 'non-core';
  timePressure: number;
  workaroundAvailable: boolean;
  historicalIssues: boolean;
}

// =============================================================================
// Helper Types — Ticket Management
// =============================================================================

/**
 * Request payload for creating a zmind ticket.
 * All 7 fields are required for successful submission.
 */
export interface TicketCreationRequest {
  customerName: string;
  module: SubsystemType;
  issueCategory: string;
  description: string;
  version: string;
  reproductionSteps: string;
  environmentDetails: string;
}

/**
 * Result of a validation operation (used across multiple validators).
 */
export interface ValidationResult {
  isValid: boolean;
  errors: string[];
}

// =============================================================================
// Helper Types — Technical Q&A
// =============================================================================

/**
 * A possible cause in a diagnostic analysis with likelihood assessment.
 */
export interface PossibleCause {
  description: string;
  likelihood: LikelihoodLevel;
}

/**
 * Structured response from the Technical Q&A Engine.
 */
export interface TechnicalQAResponse {
  subsystem: SubsystemType;
  possibleCauses: PossibleCause[];           // 1-5 items
  troubleshootingPath: string[];             // ordered steps
  informationNeeded: string[];
  logsToCollect: LogRecommendation[];
  nextSteps: string[];
  escalationRecommendation: 'escalate' | 'not-required';
  massProductionImpact: 'yes' | 'no' | 'unknown';
  confidence: ConfidenceLevel;
  rdQuestions?: string[];                    // required when confidence is medium/low
}

// =============================================================================
// Helper Types — Log Advisor
// =============================================================================

/**
 * A single log recommendation with ADB collection command.
 */
export interface LogRecommendation {
  logType: string;
  source: string;
  command: string;                           // ADB command or collection method
  priority: 'mandatory' | 'optional';
}

// =============================================================================
// Helper Types — Knowledge Base
// =============================================================================

/**
 * A search result from the knowledge base with relevance and applicability.
 */
export interface KnowledgeSearchResult {
  entry: KnowledgeEntry;
  relevanceScore: number;
  applicability: 'directly-applies' | 'partially-applies' | 'does-not-apply';
  summary: string;
}
