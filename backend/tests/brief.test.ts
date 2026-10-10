import { beforeEach, describe, expect, it, vi } from 'vitest';
import request from 'supertest';

const sendMail = vi.fn();
const verify = vi.fn().mockResolvedValue(true);

vi.mock('nodemailer', () => ({
  default: {
    createTransport: () => ({ sendMail, verify }),
  },
}));

import { createApp } from '../src/app.js';
import { _reset } from '../src/lib/store.js';

const app = createApp();

const validPayload = () => ({
  submissionId: 'test-submission-0001',
  fullName: 'Ada Lovelace',
  email: 'ada@example.com',
  company: 'Analytical Engines',
  country: 'United Kingdom',
  projectName: 'Aurora Platform',
  projectCategory: 'Web Application' as const,
  projectDescription: 'A premium analytics platform for measuring engine performance.',
  confirmAccurate: true,
  privacyAck: true,
});

beforeEach(() => {
  _reset();
  sendMail.mockReset();
  sendMail.mockResolvedValue({ messageId: 'mock-message-id', accepted: ['owner@mulab.test'] });
  verify.mockResolvedValue(true);
});

describe('POST /api/brief', () => {
  it('accepts a valid brief and reports a reference id', async () => {
    const res = await request(app).post('/api/brief').send(validPayload());

    expect(res.status).toBe(200);
    expect(res.body.ok).toBe(true);
    expect(res.body.referenceId).toMatch(/^MUL-/);
    expect(sendMail).toHaveBeenCalledTimes(2); // owner + client confirmation
  });

  it('rejects an invalid email with field errors', async () => {
    const res = await request(app)
      .post('/api/brief')
      .send({ ...validPayload(), email: 'not-an-email' });

    expect(res.status).toBe(422);
    expect(res.body.fieldErrors.email).toBeDefined();
    expect(sendMail).not.toHaveBeenCalled();
  });

  it('rejects a submission missing required fields', async () => {
    const payload: Record<string, unknown> = validPayload();
    delete payload.fullName;
    const res = await request(app).post('/api/brief').send(payload);

    expect(res.status).toBe(422);
    expect(res.body.fieldErrors.fullName).toBeDefined();
  });

  it('silently discards honeypot submissions without sending mail', async () => {
    const res = await request(app).post('/api/brief').send({ ...validPayload(), website: 'http://spam.example' });

    expect(res.status).toBe(200);
    expect(res.body.ok).toBe(true);
    expect(sendMail).not.toHaveBeenCalled();
  });

  it('returns 502 when the mail transport fails', async () => {
    sendMail.mockRejectedValueOnce(new Error('SMTP down'));
    const res = await request(app).post('/api/brief').send(validPayload());

    expect(res.status).toBe(502);
    expect(res.body.error).toMatch(/could not deliver/i);
  });

  it('prevents duplicate notifications for the same submission id', async () => {
    const first = await request(app).post('/api/brief').send(validPayload());
    const second = await request(app).post('/api/brief').send(validPayload());

    expect(first.status).toBe(200);
    expect(second.status).toBe(200);
    expect(second.body.duplicate).toBe(true);
    expect(second.body.referenceId).toBe(first.body.referenceId);
    expect(sendMail).toHaveBeenCalledTimes(2); // delivered once
  });

  it('sets replyTo to the client email and sends from the authenticated account', async () => {
    await request(app).post('/api/brief').send(validPayload());

    const ownerCall = sendMail.mock.calls[0][0];
    expect(ownerCall.replyTo).toBe('ada@example.com');
    expect(ownerCall.from).toContain('studio@mulab.test');
    expect(ownerCall.subject).toContain('Aurora Platform');
  });
});

describe('GET /api/health', () => {
  it('reports the email configuration state', async () => {
    const res = await request(app).get('/api/health');
    expect(res.status).toBe(200);
    expect(res.body.emailConfigured).toBe(true);
  });
});
