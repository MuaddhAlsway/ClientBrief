import { escapeHtml } from '../utils/html.js';

export interface EmailSection {
  title: string;
  rows: Array<[label: string, value: string]>;
}

const FONT =
  "-apple-system,BlinkMacSystemFont,'Segoe UI',Helvetica,Arial,sans-serif";
const MONO = "'IBM Plex Mono','SFMono-Regular',Consolas,monospace";

export function renderEmail(options: {
  preheader: string;
  eyebrow: string;
  heading: string;
  intro?: string;
  sections?: EmailSection[];
  referenceId?: string;
  submittedAt?: string;
  footer?: string;
}): string {
  const { preheader, eyebrow, heading, intro, sections = [], referenceId, submittedAt, footer } = options;

  const sectionsHtml = sections
    .map(
      (section) => `
      <tr><td style="padding:0 0 8px 0">
        <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="border-collapse:collapse">
          <tr><td style="padding:24px 0 8px 0;border-top:1px solid #e5e5e5">
            <div style="font-family:${MONO};font-size:11px;letter-spacing:.18em;text-transform:uppercase;color:#71717a">${escapeHtml(section.title)}</div>
          </td></tr>
          ${section.rows
            .map(
              ([label, value]) => `
          <tr>
            <td style="padding:7px 0;vertical-align:top;width:190px;font-family:${FONT};font-size:13px;color:#71717a">${escapeHtml(label)}</td>
            <td style="padding:7px 0;vertical-align:top;font-family:${FONT};font-size:14px;color:#0a0a0a;line-height:1.6;white-space:pre-wrap">${escapeHtml(value || '—')}</td>
          </tr>`,
            )
            .join('')}
        </table>
      </td></tr>`,
    )
    .join('');

  const metaHtml =
    referenceId || submittedAt
      ? `<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="border-collapse:collapse;background:#f5f5f5;border-radius:10px;margin-top:24px">
          <tr>
            ${referenceId ? `<td style="padding:14px 18px;font-family:${MONO};font-size:11px;color:#71717a;letter-spacing:.08em">REFERENCE<br><span style="font-family:${FONT};font-size:14px;color:#0a0a0a;letter-spacing:0">${escapeHtml(referenceId)}</span></td>` : ''}
            ${submittedAt ? `<td style="padding:14px 18px;font-family:${MONO};font-size:11px;color:#71717a;letter-spacing:.08em">SUBMITTED<br><span style="font-family:${FONT};font-size:14px;color:#0a0a0a;letter-spacing:0">${escapeHtml(submittedAt)}</span></td>` : ''}
          </tr>
        </table>`
      : '';

  return `<!doctype html>
<html lang="en">
<head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>${escapeHtml(heading)}</title></head>
<body style="margin:0;padding:0;background:#ffffff">
  <div style="display:none;max-height:0;overflow:hidden;opacity:0">${escapeHtml(preheader)}</div>
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="border-collapse:collapse;background:#ffffff">
    <tr><td align="center" style="padding:40px 16px">
      <table role="presentation" width="600" cellpadding="0" cellspacing="0" style="border-collapse:collapse;max-width:600px;width:100%;background:#ffffff">
        <tr><td>
          <div style="font-family:${FONT};font-size:22px;font-weight:700;letter-spacing:-.02em;color:#0a0a0a">MU.LAB</div>
          <div style="font-family:${MONO};font-size:11px;letter-spacing:.22em;text-transform:uppercase;color:#a1a1aa;margin-top:6px">${escapeHtml(eyebrow)}</div>
        </td></tr>
        <tr><td style="padding:28px 0 0 0">
          <h1 style="font-family:${FONT};font-size:26px;line-height:1.25;letter-spacing:-.02em;color:#0a0a0a;margin:0 0 12px 0">${escapeHtml(heading)}</h1>
          ${intro ? `<p style="font-family:${FONT};font-size:15px;line-height:1.65;color:#3f3f46;margin:0">${escapeHtml(intro)}</p>` : ''}
        </td></tr>
        ${sectionsHtml ? `<tr><td style="padding-top:8px"><table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="border-collapse:collapse">${sectionsHtml}</table></td></tr>` : ''}
        ${metaHtml}
        <tr><td style="padding:32px 0 0 0;border-top:1px solid #e5e5e5;margin-top:32px">
          <div style="font-family:${MONO};font-size:10px;letter-spacing:.16em;text-transform:uppercase;color:#a1a1aa">${escapeHtml(footer ?? 'MU.LAB — Digital Experiences, Thoughtfully Engineered.')}</div>
        </td></tr>
      </table>
    </td></tr>
  </table>
</body>
</html>`;
}
