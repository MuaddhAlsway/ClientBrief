import type { BriefPayload } from '../validators/briefSchema.js';
import { renderEmail } from './layout.js';

const PLAIN = [
  'Thank you for reaching out to MU.LAB.',
  '',
  'Your project brief has been received successfully.',
  '',
  "We'll review your requirements and contact you regarding the next steps.",
  '',
  'MU.LAB',
  'Digital Experiences, Thoughtfully Engineered.',
].join('\n');

export function buildClientEmail(data: BriefPayload, referenceId: string, privacyPolicyUrl: string) {
  const html = renderEmail({
    preheader: "We've received your project brief.",
    eyebrow: 'Acknowledgement',
    heading: "We've Received Your Project Brief",
    intro:
      'Thank you for reaching out to MU.LAB. Your project brief has been received successfully. We will review your requirements and contact you regarding the next steps.',
    sections: [
      {
        title: 'Summary',
        rows: [
          ['Project', data.projectName],
          ['Category', data.projectCategory],
          ['Contact preference', data.contactMethod],
        ],
      },
    ],
    referenceId,
    footer: 'MU.LAB — Digital Experiences, Thoughtfully Engineered.',
  });

  const withPrivacy = privacyPolicyUrl
    ? html.replace(
        'MU.LAB — Digital Experiences, Thoughtfully Engineered.',
        `MU.LAB — Digital Experiences, Thoughtfully Engineered.<br><a href="${privacyPolicyUrl}" style="color:#71717a;text-decoration:underline">Privacy Policy</a>`,
      )
    : html;

  return { subject: "MU.LAB — We've Received Your Project Brief", html: withPrivacy, text: PLAIN, referenceId };
}
