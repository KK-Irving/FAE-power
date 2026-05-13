/**
 * Unit tests for workflow state management.
 * Validates initialization, advancement, skipping, backward navigation,
 * and available actions logic.
 */

import { describe, it, expect } from 'vitest';
import {
  WORKFLOW_STAGES,
  initializeWorkflow,
  advanceToNextStage,
  skipCurrentStage,
  navigateBack,
  getAvailableActions,
} from '../../src/utils/workflow-state.js';

describe('workflow-state', () => {
  describe('WORKFLOW_STAGES', () => {
    it('contains exactly 12 stages in the correct order', () => {
      expect(WORKFLOW_STAGES).toEqual([
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
      ]);
      expect(WORKFLOW_STAGES.length).toBe(12);
    });
  });

  describe('initializeWorkflow', () => {
    it('creates state starting at completeness-check with empty history', () => {
      const state = initializeWorkflow('Test issue');
      expect(state.issueDescription).toBe('Test issue');
      expect(state.currentStage).toBe('completeness-check');
      expect(state.completedStages).toEqual([]);
      expect(state.skippedStages).toEqual([]);
    });

    it('preserves the issue description exactly', () => {
      const desc = '客户反馈开机黑屏问题 - Boot failure on Model X';
      const state = initializeWorkflow(desc);
      expect(state.issueDescription).toBe(desc);
    });
  });

  describe('advanceToNextStage', () => {
    it('moves current stage to completed and advances to next', () => {
      const initial = initializeWorkflow('Test');
      const advanced = advanceToNextStage(initial);

      expect(advanced.currentStage).toBe('risk-assessment');
      expect(advanced.completedStages).toEqual(['completeness-check']);
    });

    it('does not mutate the original state', () => {
      const initial = initializeWorkflow('Test');
      advanceToNextStage(initial);

      expect(initial.currentStage).toBe('completeness-check');
      expect(initial.completedStages).toEqual([]);
    });

    it('returns unchanged state when at last stage', () => {
      let state = initializeWorkflow('Test');
      // Advance through all stages to reach post-mortem
      for (let i = 0; i < 11; i++) {
        state = advanceToNextStage(state);
      }
      expect(state.currentStage).toBe('post-mortem');

      const result = advanceToNextStage(state);
      expect(result.currentStage).toBe('post-mortem');
    });

    it('accumulates completed stages correctly', () => {
      let state = initializeWorkflow('Test');
      state = advanceToNextStage(state); // completeness-check → risk-assessment
      state = advanceToNextStage(state); // risk-assessment → log-collection

      expect(state.currentStage).toBe('log-collection');
      expect(state.completedStages).toEqual([
        'completeness-check',
        'risk-assessment',
      ]);
    });
  });

  describe('skipCurrentStage', () => {
    it('adds current stage to skipped list with timestamp and advances', () => {
      const initial = initializeWorkflow('Test');
      const skipped = skipCurrentStage(initial);

      expect(skipped.currentStage).toBe('risk-assessment');
      expect(skipped.skippedStages.length).toBe(1);
      expect(skipped.skippedStages[0].stage).toBe('completeness-check');
      expect(skipped.skippedStages[0].timestamp).toBeTruthy();
    });

    it('produces a valid ISO timestamp', () => {
      const initial = initializeWorkflow('Test');
      const skipped = skipCurrentStage(initial);

      const timestamp = skipped.skippedStages[0].timestamp;
      const parsed = new Date(timestamp);
      expect(parsed.toISOString()).toBe(timestamp);
    });

    it('does not mutate the original state', () => {
      const initial = initializeWorkflow('Test');
      skipCurrentStage(initial);

      expect(initial.currentStage).toBe('completeness-check');
      expect(initial.skippedStages).toEqual([]);
    });

    it('returns unchanged state when at last stage', () => {
      let state = initializeWorkflow('Test');
      for (let i = 0; i < 11; i++) {
        state = advanceToNextStage(state);
      }
      expect(state.currentStage).toBe('post-mortem');

      const result = skipCurrentStage(state);
      expect(result.currentStage).toBe('post-mortem');
      expect(result.skippedStages.length).toBe(state.skippedStages.length);
    });
  });

  describe('navigateBack', () => {
    it('navigates to a previously completed stage', () => {
      let state = initializeWorkflow('Test');
      state = advanceToNextStage(state); // → risk-assessment
      state = advanceToNextStage(state); // → log-collection

      const result = navigateBack(state, 'completeness-check');
      expect(result.currentStage).toBe('completeness-check');
      expect(result.completedStages).toEqual([]);
    });

    it('navigates to a previously skipped stage', () => {
      let state = initializeWorkflow('Test');
      state = skipCurrentStage(state);   // skip completeness-check → risk-assessment
      state = advanceToNextStage(state); // → log-collection

      const result = navigateBack(state, 'completeness-check');
      expect(result.currentStage).toBe('completeness-check');
      expect(result.completedStages).toEqual([]);
      expect(result.skippedStages).toEqual([]);
    });

    it('preserves history of stages completed before the target', () => {
      let state = initializeWorkflow('Test');
      state = advanceToNextStage(state); // completeness-check → risk-assessment
      state = advanceToNextStage(state); // risk-assessment → log-collection
      state = advanceToNextStage(state); // log-collection → knowledge-query

      const result = navigateBack(state, 'log-collection');
      expect(result.currentStage).toBe('log-collection');
      expect(result.completedStages).toEqual([
        'completeness-check',
        'risk-assessment',
      ]);
    });

    it('returns unchanged state for invalid target (not completed or skipped)', () => {
      let state = initializeWorkflow('Test');
      state = advanceToNextStage(state); // → risk-assessment

      const result = navigateBack(state, 'post-mortem');
      expect(result.currentStage).toBe('risk-assessment');
    });

    it('does not mutate the original state', () => {
      let state = initializeWorkflow('Test');
      state = advanceToNextStage(state);
      state = advanceToNextStage(state);

      const originalCurrent = state.currentStage;
      navigateBack(state, 'completeness-check');

      expect(state.currentStage).toBe(originalCurrent);
    });
  });

  describe('getAvailableActions', () => {
    it('returns next and skip at the first stage with no history', () => {
      const state = initializeWorkflow('Test');
      const actions = getAvailableActions(state);

      expect(actions).toContain('next');
      expect(actions).toContain('skip');
      expect(actions).not.toContain('back');
    });

    it('adds back when there are completed stages', () => {
      let state = initializeWorkflow('Test');
      state = advanceToNextStage(state);

      const actions = getAvailableActions(state);
      expect(actions).toContain('next');
      expect(actions).toContain('skip');
      expect(actions).toContain('back');
    });

    it('adds back when there are skipped stages', () => {
      let state = initializeWorkflow('Test');
      state = skipCurrentStage(state);

      const actions = getAvailableActions(state);
      expect(actions).toContain('next');
      expect(actions).toContain('skip');
      expect(actions).toContain('back');
    });

    it('at last stage only back is available (no next or skip)', () => {
      let state = initializeWorkflow('Test');
      for (let i = 0; i < 11; i++) {
        state = advanceToNextStage(state);
      }
      expect(state.currentStage).toBe('post-mortem');

      const actions = getAvailableActions(state);
      expect(actions).not.toContain('next');
      expect(actions).not.toContain('skip');
      expect(actions).toContain('back');
    });

    it('at last stage with no history returns empty actions', () => {
      // Edge case: manually construct a state at last stage with no history
      const state: import('../../src/types/index.js').WorkflowState = {
        issueDescription: 'Test',
        currentStage: 'post-mortem',
        completedStages: [],
        skippedStages: [],
      };

      const actions = getAvailableActions(state);
      expect(actions).toEqual([]);
    });
  });
});
