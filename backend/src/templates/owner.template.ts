import type { BriefPayload } from '../validators/briefSchema.js';
import { singleLine } from '../utils/html.js';
import { renderEmail, type EmailSection } from './layout.js';

const joiner = (values: string[] | undefined, other?: string): string => {
  const list = [...(values ?? [])];
  if (other && other.trim()) list.push(other.trim());
  return list.length ? list.join(', ') : '—';
};

function buildSections(data: BriefPayload): EmailSection[] {
  return [
    {
      title: 'Client Information',
      rows: [
        ['Name', data.fullName],
        ['Email', data.email],
        ['Company', data.company],
        ['Phone', data.phone || '—'],
        ['WhatsApp', data.whatsapp || '—'],
        ['Website', data.companyWebsite || '—'],
        ['Location', [data.city, data.country].filter(Boolean).join(', ')],
        ['Preferred contact', data.contactMethod],
      ],
    },
    {
      title: 'Project Overview',
      rows: [
        ['Project name', data.projectName],
        ['Category', data.projectCategory],
        ['Product stage', data.businessStage],
        ['Industry', data.businessIndustry || '—'],
        ['Description', data.projectDescription],
        ['Problem to solve', data.problemSolved || '—'],
        ['Business goals', joiner(data.businessGoals, data.businessGoalsOther)],
        ['Target audience', data.targetAudience || '—'],
        ['Target market', data.targetMarket || '—'],
        ['Customer needs', data.customerNeeds || '—'],
        ['Customer pain points', data.customerPainPoints || '—'],
      ],
    },
    {
      title: 'Project Requirements',
      rows: [
        ['Features', joiner(data.features, data.featuresOther)],
        ['Functional requirements', data.featureRequirements || '—'],
        ['Expected pages', data.expectedPages || '—'],
        ['User roles', data.userRoles || '—'],
        ['Existing integrations', data.existingIntegrations || '—'],
        ['Required languages', data.requiredLanguages || '—'],
        ['Expected traffic', data.expectedTraffic || '—'],
        ['Content management', data.contentManagement || '—'],
        ['Future expansion', data.futureExpansion || '—'],
        ['Technical constraints', data.technicalConstraints || '—'],
        ['Preferred tech stack', data.preferredTechStack || '—'],
        ['Existing hosting', data.existingHosting],
        ['Domain availability', data.domainAvailability],
        ['Security requirements', data.securityRequirements || '—'],
        ['Performance requirements', data.performanceRequirements || '—'],
        ['Accessibility requirements', data.accessibilityRequirements || '—'],
        ['Scalability requirements', data.scalabilityRequirements || '—'],
      ],
    },
    {
      title: 'Design Preferences',
      rows: [
        ['Has logo', data.hasLogo],
        ['Brand guidelines', data.hasBrandGuidelines],
        ['Brand colors', data.brandColors || '—'],
        ['Preferred typography', data.preferredTypography || '—'],
        ['Existing design assets', data.existingDesignAssets || '—'],
        ['Media availability', data.mediaAvailability],
        ['Design direction', joiner(data.designDirections, data.designDirectionOther)],
        ['Inspiration 1', data.inspiration1 || '—'],
        ['Inspiration 2', data.inspiration2 || '—'],
        ['Inspiration 3', data.inspiration3 || '—'],
        ['Competitor 1', data.competitor1 || '—'],
        ['Competitor 2', data.competitor2 || '—'],
        ['What they like', data.designLikes || '—'],
        ['What to avoid', data.designAvoid || '—'],
        ['Additional notes', data.designNotes || '—'],
        ['Reference files', data.fileLinks.length ? data.fileLinks.join(', ') : '—'],
      ],
    },
    {
      title: 'Budget & Timeline',
      rows: [
        ['Budget', data.budget],
        ['Start date', data.startDate || '—'],
        ['Launch date', data.launchDate || '—'],
        ['Flexibility', data.timelineFlexibility || '—'],
        ['Urgency', data.urgency],
        ['Existing project', data.hasExistingProject],
        ['Migration required', data.migrationRequired],
        ['Ongoing maintenance', data.ongoingMaintenance],
        ['Hosting support', data.hostingSupport],
        ['Post-launch support', data.postLaunchSupport],
      ],
    },
    {
      title: 'Consent',
      rows: [
        ['Accuracy confirmed', data.confirmAccurate ? 'Yes' : 'No'],
        ['Privacy accepted', data.privacyAck ? 'Yes' : 'No'],
        ['Marketing consent', data.marketingConsent ? 'Yes' : 'No'],
        ['Submitted in', data.locale === 'ar' ? 'Arabic' : 'English'],
      ],
    },
  ];
}

function buildPlainText(data: BriefPayload, referenceId: string, submittedAt: string): string {
  const lines: string[] = ['MU.LAB', 'NEW PROJECT SUBMISSION', ''];

  for (const section of buildSections(data)) {
    lines.push(section.title.toUpperCase(), '-'.repeat(section.title.length));
    for (const [label, value] of section.rows) {
      lines.push(`${label}: ${value || '—'}`);
    }
    lines.push('');
  }

  lines.push(`Reference: ${referenceId}`, `Submitted: ${submittedAt}`, '', 'MU.LAB — Digital Experiences, Thoughtfully Engineered.');
  return lines.join('\n');
}

export function buildOwnerEmail(data: BriefPayload, referenceId: string, submittedAt: string) {
  const subject = `[MU.LAB] New Project Inquiry — ${singleLine(data.projectName, 90) || 'Untitled Project'}`;
  const html = renderEmail({
    preheader: `New project inquiry from ${data.fullName}${data.company ? ` (${data.company})` : ''}.`,
    eyebrow: 'New Project Submission',
    heading: 'New Project Inquiry',
    intro: `${data.fullName}${data.company ? ` from ${data.company}` : ''} submitted a project brief. Reply to this email to respond directly.`,
    sections: buildSections(data),
    referenceId,
    submittedAt,
  });

  return { subject, html, text: buildPlainText(data, referenceId, submittedAt) };
}
