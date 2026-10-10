import type { BriefFormValues } from '@/schemas/briefSchema';

const API_BASE = (import.meta.env.VITE_API_URL as string | undefined)?.replace(/\/$/, '') ?? '';

export interface SubmitResult {
  ok: true;
  referenceId: string;
  duplicate: boolean;
  clientConfirmationSent: boolean;
}

export class ApiError extends Error {
  status: number;
  fieldErrors?: Record<string, string>;

  constructor(message: string, status: number, fieldErrors?: Record<string, string>) {
    super(message);
    this.name = 'ApiError';
    this.status = status;
    this.fieldErrors = fieldErrors;
  }
}

export async function submitBrief(values: BriefFormValues): Promise<SubmitResult> {
  let response: Response;
  try {
    response = await fetch(`${API_BASE}/api/brief`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(values),
    });
  } catch {
    throw new ApiError('network', 0);
  }

  let payload: Record<string, unknown> = {};
  try {
    payload = (await response.json()) as Record<string, unknown>;
  } catch {
    payload = {};
  }

  if (!response.ok) {
    const message = typeof payload.error === 'string' ? payload.error : 'error';
    throw new ApiError(message, response.status, payload.fieldErrors as Record<string, string> | undefined);
  }

  return payload as unknown as SubmitResult;
}
