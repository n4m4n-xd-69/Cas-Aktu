import { act, renderHook } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import { useSlideshow } from './useSlideshow';

beforeEach(() => vi.useFakeTimers());
afterEach(() => vi.useRealTimers());

describe('useSlideshow', () => {
  it('advances once per interval and wraps', () => {
    const { result } = renderHook(() => useSlideshow(3, { intervalMs: 1000 }));
    expect(result.current.index).toBe(0);

    act(() => void vi.advanceTimersByTime(1000));
    expect(result.current.index).toBe(1);

    act(() => void vi.advanceTimersByTime(2000));
    expect(result.current.index).toBe(0);
  });

  it('delays the first advance by the stagger offset', () => {
    const { result } = renderHook(() =>
      useSlideshow(3, { intervalMs: 1000, offsetMs: 500 }),
    );

    act(() => void vi.advanceTimersByTime(999));
    expect(result.current.index).toBe(0);

    act(() => void vi.advanceTimersByTime(501));
    expect(result.current.index).toBe(1);
  });

  it('does not advance while paused', () => {
    const { result } = renderHook(() =>
      useSlideshow(3, { intervalMs: 1000, paused: true }),
    );

    act(() => void vi.advanceTimersByTime(5000));
    expect(result.current.index).toBe(0);
  });

  it('restarts the interval after a manual seek', () => {
    const { result } = renderHook(() => useSlideshow(3, { intervalMs: 1000 }));

    act(() => void vi.advanceTimersByTime(900));
    act(() => result.current.goTo(2));
    expect(result.current.index).toBe(2);

    // The 100ms left on the old timer must not fire.
    act(() => void vi.advanceTimersByTime(100));
    expect(result.current.index).toBe(2);

    act(() => void vi.advanceTimersByTime(900));
    expect(result.current.index).toBe(0);
  });

  it('wraps backwards from the first slide', () => {
    const { result } = renderHook(() => useSlideshow(3, { intervalMs: 1000 }));
    act(() => result.current.prev());
    expect(result.current.index).toBe(2);
  });

  it('stays on slide 0 for a single-slide set', () => {
    const { result } = renderHook(() => useSlideshow(1, { intervalMs: 1000 }));
    act(() => void vi.advanceTimersByTime(5000));
    expect(result.current.index).toBe(0);
  });
});
