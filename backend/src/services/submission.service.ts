import { markDelivered, markFailed, reserve } from '../lib/store.js';
import type { BriefPayload } from '../validators/briefSchema.js';
import {
  EmailNotConfiguredError,
  isEmailConfigured,
  sendClientConfirmation,
  sendOwnerBrief,
} from './email.service.js';

export class DuplicateInFlightError extends Error {
  constructor() {
    super('A submission with this reference is already being processed.');
    this.name = 'DuplicateInFlightError';
  }
}

export interface SubmissionResult {
  referenceId: string;
  duplicate: boolean;
  clientConfirmationSent: boolean;
}

export async function processBrief(data: BriefPayload): Promise<SubmissionResult> {
  if (!isEmailConfigured()) {
    throw new EmailNotConfiguredError();
  }

  const reservation = await reserve(data.submissionId, data);

  if (reservation.state === 'duplicate_delivered') {
    return { referenceId: reservation.referenceId, duplicate: true, clientConfirmationSent: false };
  }

  if (reservation.state === 'duplicate_in_flight') {
    throw new DuplicateInFlightError();
  }

  const { referenceId } = reservation;

  try {
    await sendOwnerBrief(data, referenceId);
  } catch (error) {
    await markFailed(data.submissionId);
    throw error;
  }

  await markDelivered(data.submissionId);
  const clientConfirmationSent = await sendClientConfirmation(data, referenceId);

  return { referenceId, duplicate: false, clientConfirmationSent };
}
