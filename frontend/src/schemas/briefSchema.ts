import { z } from 'zod';
import type { TranslationKey } from '@/i18n/translations';
import {
  BUDGETS,
  BUSINESS_GOALS,
  BUSINESS_STAGES,
  CONTACT_METHODS,
  DESIGN_DIRECTIONS,
  FEATURES,
  PROJECT_CATEGORIES,
  TIMELINE_FLEXIBILITY,
  URGENCY_LEVELS,
  YES_NO_UNSURE,
} from '@/types/brief';

type T = (key: TranslationKey, vars?: Record<string, string | number>) => string;

const optionalString = (max: number) => z.string().max(max).optional();

export function createBriefSchema(t: T) {
  const optionalUrl = z
    .string()
    .max(300)
    .optional()
    .refine(
      (value) => !value || /^https?:\/\/[^\s]+\.[^\s]+$/i.test(value) || /^[^\s]+\.[^\s]{2,}$/i.test(value),
      { message: t('validation.url') },
    );

  const optionalPhone = z
    .string()
    .max(30)
    .optional()
    .refine((value) => !value || /^[+()\-\s\d.]{6,30}$/.test(value), { message: t('validation.phone') });

  const enumField = <TU extends readonly [string, ...string[]]>(values: TU) =>
    z.enum(values, { errorMap: () => ({ message: t('validation.required') }) });

  const multi = <TU extends readonly [string, ...string[]]>(values: TU) =>
    z.array(z.enum(values)).max(values.length).optional();

  const enumWithRequired = <TU extends readonly [string, ...string[]]>(values: TU, required = true) =>
    required
      ? z.enum(values, { errorMap: () => ({ message: t('validation.required') }) })
      : z.enum(values).optional();

  const fields = {
    submissionId: z.string().min(1),
    website: z.string().optional(),

    fullName: z.string().min(2, t('validation.fullName')).max(120),
    email: z.string().min(1, t('validation.required')).email(t('validation.email')).max(254),
    phone: optionalPhone,
    whatsapp: optionalPhone,
    company: z.string().min(1, t('validation.company')).max(150),
    companyWebsite: optionalUrl,
    country: z.string().min(2, t('validation.country')).max(80),
    city: optionalString(80),
    contactMethod: enumField(CONTACT_METHODS),

    projectName: z.string().min(2, t('validation.projectName')).max(150),
    projectCategory: enumField(PROJECT_CATEGORIES),
    projectDescription: z.string().min(20, t('validation.projectDescription')).max(4000),
    businessIndustry: optionalString(150),
    businessStage: enumField(BUSINESS_STAGES),
    businessGoals: multi(BUSINESS_GOALS),
    businessGoalsOther: optionalString(300),
    problemSolved: optionalString(2000),
    targetAudience: optionalString(1000),
    targetMarket: optionalString(300),
    customerNeeds: optionalString(1500),
    customerPainPoints: optionalString(1500),

    features: multi(FEATURES),
    featuresOther: optionalString(300),
    featureRequirements: optionalString(4000),
    expectedPages: optionalString(80),
    userRoles: optionalString(500),
    existingIntegrations: optionalString(1000),
    requiredLanguages: optionalString(300),
    expectedTraffic: optionalString(200),
    futureExpansion: optionalString(1500),
    contentManagement: optionalString(1000),
    technicalConstraints: optionalString(1500),
    preferredTechStack: optionalString(500),
    existingHosting: enumField(YES_NO_UNSURE),
    domainAvailability: enumField(YES_NO_UNSURE),
    securityRequirements: optionalString(1000),
    performanceRequirements: optionalString(1000),
    accessibilityRequirements: optionalString(1000),
    scalabilityRequirements: optionalString(1000),

    hasLogo: enumField(YES_NO_UNSURE),
    hasBrandGuidelines: enumField(YES_NO_UNSURE),
    brandColors: optionalString(300),
    preferredTypography: optionalString(300),
    existingDesignAssets: optionalString(1000),
    mediaAvailability: enumField(YES_NO_UNSURE),
    designDirections: multi(DESIGN_DIRECTIONS),
    designDirectionOther: optionalString(200),
    inspiration1: optionalUrl,
    inspiration2: optionalUrl,
    inspiration3: optionalUrl,
    competitor1: optionalUrl,
    competitor2: optionalUrl,
    designLikes: optionalString(2000),
    designAvoid: optionalString(2000),
    designNotes: optionalString(2000),
    fileLinks: z.array(z.string().max(500)).max(10).optional(),

    budget: enumField(BUDGETS),
    startDate: optionalString(40),
    launchDate: optionalString(40),
    timelineFlexibility: enumWithRequired(TIMELINE_FLEXIBILITY, false),
    urgency: enumField(URGENCY_LEVELS),
    hasExistingProject: enumField(YES_NO_UNSURE),
    migrationRequired: enumField(YES_NO_UNSURE),
    ongoingMaintenance: enumField(YES_NO_UNSURE),
    hostingSupport: enumField(YES_NO_UNSURE),
    postLaunchSupport: enumField(YES_NO_UNSURE),

    confirmAccurate: z.boolean().refine((value) => value === true, { message: t('validation.confirm') }),
    privacyAck: z.boolean().refine((value) => value === true, { message: t('validation.privacy') }),
    marketingConsent: z.boolean().optional(),
    locale: z.enum(['en', 'ar']).optional(),
  };

  return z.object(fields);
}

export const STEP_FIELDS = {
  1: ['fullName', 'email', 'phone', 'whatsapp', 'company', 'companyWebsite', 'country', 'city', 'contactMethod'],
  2: [
    'projectName',
    'projectCategory',
    'projectDescription',
    'businessIndustry',
    'businessStage',
    'businessGoals',
    'businessGoalsOther',
    'problemSolved',
    'targetAudience',
    'targetMarket',
    'customerNeeds',
    'customerPainPoints',
  ],
  3: [
    'features',
    'featuresOther',
    'featureRequirements',
    'expectedPages',
    'userRoles',
    'existingIntegrations',
    'requiredLanguages',
    'expectedTraffic',
    'futureExpansion',
    'contentManagement',
    'technicalConstraints',
    'preferredTechStack',
    'existingHosting',
    'domainAvailability',
    'securityRequirements',
    'performanceRequirements',
    'accessibilityRequirements',
    'scalabilityRequirements',
  ],
  4: [
    'hasLogo',
    'hasBrandGuidelines',
    'brandColors',
    'preferredTypography',
    'existingDesignAssets',
    'mediaAvailability',
    'designDirections',
    'designDirectionOther',
    'inspiration1',
    'inspiration2',
    'inspiration3',
    'competitor1',
    'competitor2',
    'designLikes',
    'designAvoid',
    'designNotes',
    'fileLinks',
  ],
  5: [
    'budget',
    'startDate',
    'launchDate',
    'timelineFlexibility',
    'urgency',
    'hasExistingProject',
    'migrationRequired',
    'ongoingMaintenance',
    'hostingSupport',
    'postLaunchSupport',
  ],
  6: ['confirmAccurate', 'privacyAck', 'marketingConsent'],
} as const;

export type BriefFormValues = z.infer<ReturnType<typeof createBriefSchema>>;
