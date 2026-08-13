import { describe, expect, it } from 'vitest';

import { isAdmissionsSeason } from './admissions';

/** Month is 1-indexed here for readability; Date's is not. */
const on = (month: number, day = 15) => new Date(2026, month - 1, day);

describe('isAdmissionsSeason', () => {
  it('is open across July, August and September', () => {
    expect(isAdmissionsSeason(on(7))).toBe(true);
    expect(isAdmissionsSeason(on(8))).toBe(true);
    expect(isAdmissionsSeason(on(9))).toBe(true);
  });

  it('is closed in the months either side', () => {
    expect(isAdmissionsSeason(on(6))).toBe(false);
    expect(isAdmissionsSeason(on(10))).toBe(false);
  });

  it('includes both boundary days', () => {
    expect(isAdmissionsSeason(on(7, 1))).toBe(true);
    expect(isAdmissionsSeason(on(9, 30))).toBe(true);
    expect(isAdmissionsSeason(on(6, 30))).toBe(false);
    expect(isAdmissionsSeason(on(10, 1))).toBe(false);
  });

  it('is closed for the rest of the year', () => {
    for (const m of [1, 2, 3, 4, 5, 11, 12]) {
      expect(isAdmissionsSeason(on(m))).toBe(false);
    }
  });
});
