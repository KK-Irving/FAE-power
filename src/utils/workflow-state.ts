/**
 * Workflow state management utility module.
 *
 * Provides pure functions for managing the 12-stage FAE workflow,
 * including initialization, advancement, skipping, and backward navigation.
 * All functions return new state objects (immutable).
 */

import type { WorkflowState, WorkflowStage } from '../types/index.js';

/**
 * The ordered sequence of all 12 workflow stages.
 */
export const WORKFLOW_STAGES: readonly WorkflowStage[] = [
  'completeness-check',
  'risk-assessment',
  'log-collection',
  'knowledge-query',
  'local-reproduction',
  'zmind-ticket-creation',
  'rd-analysis-tracking',
  'progress-communication',
  'fix-verification',
  'customer-confirmation',
  'closure',
  'post-mortem',
] as const;

/**
 * Creates a new workflow state with all 12 stages in order,
 * starting at 'completeness-check'.
 */
export function initializeWorkflow(issueDescription: string): WorkflowState {
  return {
    issueDescription,
    currentStage: 'completeness-check',
    completedStages: [],
    skippedStages: [],
  };
}

/**
 * Moves to the next stage in the workflow sequence.
 * The current stage is added to completedStages, and currentStage
 * advances to the next stage in the ordered sequence.
 *
 * If already at the last stage, returns the state unchanged.
 */
export function advanceToNextStage(state: WorkflowState): WorkflowState {
  const currentIndex = WORKFLOW_STAGES.indexOf(state.currentStage);
  const nextIndex = currentIndex + 1;

  // Cannot advance past the last stage
  if (nextIndex >= WORKFLOW_STAGES.length) {
    return { ...state };
  }

  return {
    ...state,
    currentStage: WORKFLOW_STAGES[nextIndex],
    completedStages: [...state.completedStages, state.currentStage],
    skippedStages: [...state.skippedStages],
  };
}

/**
 * Skips the current stage by adding it to the skipped list with a timestamp,
 * then advances to the next stage in the sequence.
 *
 * If already at the last stage, returns the state unchanged.
 */
export function skipCurrentStage(state: WorkflowState): WorkflowState {
  const currentIndex = WORKFLOW_STAGES.indexOf(state.currentStage);
  const nextIndex = currentIndex + 1;

  // Cannot skip past the last stage
  if (nextIndex >= WORKFLOW_STAGES.length) {
    return { ...state };
  }

  return {
    ...state,
    currentStage: WORKFLOW_STAGES[nextIndex],
    completedStages: [...state.completedStages],
    skippedStages: [
      ...state.skippedStages,
      { stage: state.currentStage, timestamp: new Date().toISOString() },
    ],
  };
}

/**
 * Navigates backward to a target stage that was previously completed or skipped.
 * Sets the current stage to the target and preserves history of stages
 * completed before the target.
 *
 * The target must be a stage that appears in completedStages or skippedStages.
 * If the target is not valid, returns the state unchanged.
 */
export function navigateBack(
  state: WorkflowState,
  targetStage: WorkflowStage
): WorkflowState {
  // Verify target was previously completed or skipped
  const wasCompleted = state.completedStages.includes(targetStage);
  const wasSkipped = state.skippedStages.some((s) => s.stage === targetStage);

  if (!wasCompleted && !wasSkipped) {
    return { ...state };
  }

  const targetIndex = WORKFLOW_STAGES.indexOf(targetStage);

  // Preserve only completed stages that come before the target in the sequence
  const preservedCompleted = state.completedStages.filter((stage) => {
    const stageIndex = WORKFLOW_STAGES.indexOf(stage);
    return stageIndex < targetIndex;
  });

  // Preserve only skipped stages that come before the target in the sequence
  const preservedSkipped = state.skippedStages.filter((entry) => {
    const stageIndex = WORKFLOW_STAGES.indexOf(entry.stage);
    return stageIndex < targetIndex;
  });

  return {
    ...state,
    currentStage: targetStage,
    completedStages: preservedCompleted,
    skippedStages: preservedSkipped,
  };
}

/**
 * Returns the list of valid actions for the current workflow state.
 *
 * Rules:
 * - 'next' and 'skip' are available normally (not at last stage)
 * - 'back' is available if there are any completed or skipped stages
 * - At the last stage, only 'back' is available (no 'next' or 'skip')
 */
export function getAvailableActions(state: WorkflowState): string[] {
  const currentIndex = WORKFLOW_STAGES.indexOf(state.currentStage);
  const isLastStage = currentIndex === WORKFLOW_STAGES.length - 1;
  const hasHistory =
    state.completedStages.length > 0 || state.skippedStages.length > 0;

  const actions: string[] = [];

  if (!isLastStage) {
    actions.push('next', 'skip');
  }

  if (hasHistory) {
    actions.push('back');
  }

  return actions;
}
