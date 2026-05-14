import { describe, it, expect } from 'vitest';

describe('Project Setup', () => {
  it('should have vitest configured correctly', () => {
    expect(true).toBe(true);
  });

  it('should support ES2020 features', () => {
    const map = new Map<string, number>([['a', 1]]);
    expect(map.get('a')).toBe(1);
  });
});
