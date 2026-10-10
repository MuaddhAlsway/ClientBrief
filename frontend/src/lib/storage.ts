import type { BriefFormValues } from '@/schemas/briefSchema';

const DRAFT_KEY = 'mulab.intake.draft.v1';
const STEP_KEY = 'mulab.intake.step.v1';

// Consent + honeypot are never persisted; they must be re-affirmed each session.
const NON_PERSISTED: (keyof BriefFormValues)[] = ['confirmAccurate', 'privacyAck', 'marketingConsent', 'website', 'locale'];

export interface PersistedDraft {
  values: Partial<BriefFormValues>;
  updatedAt: number;
}

export function saveDraft(values: BriefFormValues, step: number): void {
  try {
    const clone: Partial<BriefFormValues> = { ...values };
    for (const key of NON_PERSISTED) delete clone[key];
    const draft: PersistedDraft = { values: clone, updatedAt: Date.now() };
    window.localStorage.setItem(DRAFT_KEY, JSON.stringify(draft));
    window.localStorage.setItem(STEP_KEY, String(step));
  } catch {
    // Storage may be full or disabled; drafts are a progressive enhancement.
  }
}

export function loadDraft(): PersistedDraft | null {
  try {
    const raw = window.localStorage.getItem(DRAFT_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as PersistedDraft;
    if (!parsed || typeof parsed !== 'object' || !parsed.values) return null;
    return parsed;
  } catch {
    return null;
  }
}

export function loadStep(): number {
  try {
    const raw = window.localStorage.getItem(STEP_KEY);
    const step = raw ? Number(raw) : 0;
    return Number.isFinite(step) && step >= 0 && step <= 5 ? step : 0;
  } catch {
    return 0;
  }
}

export function clearDraft(): void {
  try {
    window.localStorage.removeItem(DRAFT_KEY);
    window.localStorage.removeItem(STEP_KEY);
  } catch {
    // ignore
  }
}

export function ensureSubmissionId(): string {
  try {
    const existing = window.sessionStorage.getItem('mulab.submissionId');
    if (existing) return existing;
    const id = globalThis.crypto?.randomUUID?.() ?? `sub-${Date.now()}-${Math.random().toString(36).slice(2)}`;
    window.sessionStorage.setItem('mulab.submissionId', id);
    return id;
  } catch {
    return `sub-${Date.now()}-${Math.random().toString(36).slice(2)}`;
  }
}
