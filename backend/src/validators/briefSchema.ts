import { z } from 'zod';

export const PROJECT_CATEGORIES = [
  'Corporate Website',
  'E-Commerce Platform',
  'Web Application',
  'SaaS Platform',
  'Portfolio Website',
  'Booking Platform',
  'Dashboard / Admin Panel',
  'Custom Software',
  'Website Redesign',
  'Other',
] as const;

export const BUSINESS_GOALS = [
  'Generate leads',
  'Increase sales',
  'Build brand awareness',
  'Improve customer experience',
  'Automate business processes',
  'Launch a new product',
  'Improve existing platform',
  'Other',
] as const;

export const FEATURES = [
  'Authentication / Registration',
  'User Profiles',
  'Admin Dashboard',
  'CMS',
  'Product Management',
  'Payment Integration',
  'Booking System',
  'Search & Filtering',
  'Email Notifications',
  'WhatsApp Integration',
  'Analytics',
  'Multilingual Support',
  'Third-Party APIs',
  'Database Integration',
  'Other',
] as const;

export const DESIGN_DIRECTIONS = [
  'Minimalist',
  'Luxury / Premium',
  'Corporate',
  'Modern',
  'Editorial',
  'Creative',
  'Futuristic',
  'Bold',
  'Elegant',
] as const;

export const BUDGETS = [
  'Under 3,000 SAR',
  '3,000–5,000 SAR',
  '5,000–10,000 SAR',
  '10,000–20,000 SAR',
  '20,000–50,000 SAR',
  '50,000+ SAR',
  "Let's discuss",
] as const;

export const CONTACT_METHODS = ['Email', 'WhatsApp', 'Phone'] as const;
export const YES_NO_UNSURE = ['Yes', 'No', 'Not sure — advise me'] as const;
export const URGENCY_LEVELS = ['Flexible', 'Normal', 'High', 'Urgent'] as const;
export const TIMELINE_FLEXIBILITY = ['Fixed', 'Slightly flexible', 'Very flexible'] as const;

const optionalText = (max: number) =>
  z
    .string()
    .trim()
    .max(max, `Please keep this under ${max} characters.`)
    .optional()
    .transform((value) => value ?? '');

const optionalUrl = z
  .string()
  .trim()
  .max(300)
  .optional()
  .transform((value) => value ?? '')
  .refine(
    (value) => value === '' || /^https?:\/\/[^\s]+\.[^\s]+$/i.test(value) || /^[^\s]+\.[^\s]{2,}$/i.test(value),
    { message: 'Enter a valid website address.' },
  );

const optionalPhone = z
  .string()
  .trim()
  .max(30)
  .optional()
  .transform((value) => value ?? '')
  .refine((value) => value === '' || /^[+()\-\s\d.]{6,30}$/.test(value), {
    message: 'Enter a valid phone number.',
  });

const multiEnum = <T extends readonly [string, ...string[]]>(values: T, max: number) =>
  z
    .array(z.enum(values))
    .max(max)
    .optional()
    .transform((value) => value ?? []);

export const briefSchema = z
  .object({
    // Idempotency
    submissionId: z.string().trim().min(8).max(80),

    // Honeypot — must stay empty.
    website: z.string().max(0).optional().default(''),

    // 01 — Client information
    fullName: z.string().trim().min(2, 'Please enter your full name.').max(120),
    email: z.string().trim().email('Enter a valid email address.').max(254),
    phone: optionalPhone,
    whatsapp: optionalPhone,
    company: z.string().trim().min(1, 'Please enter your company or brand name.').max(150),
    companyWebsite: optionalUrl,
    country: z.string().trim().min(2, 'Please enter your country.').max(80),
    city: optionalText(80),
    contactMethod: z.enum(CONTACT_METHODS).default('Email'),

    // 02 — Business & project discovery
    projectName: z.string().trim().min(2, 'Please name your project.').max(150),
    projectCategory: z.enum(PROJECT_CATEGORIES),
    projectDescription: z.string().trim().min(20, 'Tell us a little more — at least 20 characters.').max(4000),
    businessIndustry: optionalText(150),
    businessStage: z.enum(['Existing business', 'Startup', 'Not sure — advise me']).optional().default('Existing business'),
    businessGoals: multiEnum(BUSINESS_GOALS, 8),
    businessGoalsOther: optionalText(300),
    problemSolved: optionalText(2000),
    targetAudience: optionalText(1000),
    targetMarket: optionalText(300),
    customerNeeds: optionalText(1500),
    customerPainPoints: optionalText(1500),

    // 03 — Project requirements
    features: multiEnum(FEATURES, 15),
    featuresOther: optionalText(300),
    featureRequirements: optionalText(4000),
    expectedPages: optionalText(80),
    userRoles: optionalText(500),
    existingIntegrations: optionalText(1000),
    requiredLanguages: optionalText(300),
    expectedTraffic: optionalText(200),
    futureExpansion: optionalText(1500),
    contentManagement: optionalText(1000),
    technicalConstraints: optionalText(1500),
    preferredTechStack: optionalText(500),
    existingHosting: z.enum(YES_NO_UNSURE).optional().default('Not sure — advise me'),
    domainAvailability: z.enum(YES_NO_UNSURE).optional().default('Not sure — advise me'),
    securityRequirements: optionalText(1000),
    performanceRequirements: optionalText(1000),
    accessibilityRequirements: optionalText(1000),
    scalabilityRequirements: optionalText(1000),

    // 04 — Design & brand preferences
    hasLogo: z.enum(YES_NO_UNSURE).optional().default('Not sure — advise me'),
    hasBrandGuidelines: z.enum(YES_NO_UNSURE).optional().default('Not sure — advise me'),
    brandColors: optionalText(300),
    preferredTypography: optionalText(300),
    existingDesignAssets: optionalText(1000),
    mediaAvailability: z.enum(YES_NO_UNSURE).optional().default('Not sure — advise me'),
    designDirections: multiEnum(DESIGN_DIRECTIONS, 9),
    designDirectionOther: optionalText(200),
    inspiration1: optionalUrl,
    inspiration2: optionalUrl,
    inspiration3: optionalUrl,
    competitor1: optionalUrl,
    competitor2: optionalUrl,
    designLikes: optionalText(2000),
    designAvoid: optionalText(2000),
    designNotes: optionalText(2000),
    fileLinks: z.array(z.string().trim().max(500)).max(10).optional().transform((value) => value ?? []),

    // 05 — Budget & timeline
    budget: z.enum(BUDGETS).default("Let's discuss"),
    startDate: optionalText(40),
    launchDate: optionalText(40),
    timelineFlexibility: z.enum(TIMELINE_FLEXIBILITY).optional(),
    urgency: z.enum(URGENCY_LEVELS).optional().default('Normal'),
    hasExistingProject: z.enum(YES_NO_UNSURE).optional().default('No'),
    migrationRequired: z.enum(YES_NO_UNSURE).optional().default('Not sure — advise me'),
    ongoingMaintenance: z.enum(YES_NO_UNSURE).optional().default('Not sure — advise me'),
    hostingSupport: z.enum(YES_NO_UNSURE).optional().default('Not sure — advise me'),
    postLaunchSupport: z.enum(YES_NO_UNSURE).optional().default('Not sure — advise me'),

    // 06 — Review & confirmation
    confirmAccurate: z.literal(true, {
      errorMap: () => ({ message: 'Please confirm the information is accurate.' }),
    }),
    privacyAck: z.literal(true, {
      errorMap: () => ({ message: 'Please acknowledge the privacy policy.' }),
    }),
    marketingConsent: z.boolean().optional().default(false),

    // Localisation of the submission (optional metadata)
    locale: z.enum(['en', 'ar']).optional().default('en'),
  })
  .strict();

export type BriefPayload = z.infer<typeof briefSchema>;
