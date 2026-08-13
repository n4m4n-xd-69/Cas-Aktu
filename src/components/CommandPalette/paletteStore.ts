import { useSyncExternalStore } from 'react';

let open = false;
const listeners = new Set<() => void>();

function emit() {
  for (const listener of listeners) listener();
}

export function openCommandPalette() {
  if (open) return;
  open = true;
  emit();
}

export function closeCommandPalette() {
  if (!open) return;
  open = false;
  emit();
}

export function toggleCommandPalette() {
  open = !open;
  emit();
}

function subscribe(listener: () => void) {
  listeners.add(listener);
  return () => listeners.delete(listener);
}

export function useCommandPaletteOpen(): boolean {
  return useSyncExternalStore(
    subscribe,
    () => open,
    () => false,
  );
}
