import type { UseFormReturn } from 'react-hook-form';
import { motion } from 'framer-motion';
import { ReviewCard, type ReviewRow } from '@/components/ReviewCard';
import { Checkbox } from '@/components/Checkbox';
import { useI18n } from '@/i18n/LanguageContext';
import type { BriefFormValues } from '@/schemas/briefSchema';

interface StepProps {
  form: UseFormReturn<BriefFormValues>;
  onEdit: (step: number) => void;
  privacyUrl?: string;
}

export function StepReview({ form, onEdit, privacyUrl = '#/privacy' }: StepProps) {
  const { t, option } = useI18n();
  const { watch, register, formState } = form;
  const values = watch();
  const errors = formState.errors;

  const join = (list: string[] | undefined, group: string, other?: string) => {
    const parts = (list ?? []).map((value) => option(group, value));
    if (other && other.trim()) parts.push(other.trim());
    return parts.join(' · ');
  };

  const groups: Array<{ title: string; step: number; rows: ReviewRow[] }> = [
    {
      title: t('review.clientInfo'),
      step: 0,
      rows: [
        { label: t('field.fullName'), value: values.fullName },
        { label: t('field.email'), value: values.email },
        { label: t('field.phone'), value: values.phone },
        { label: t('field.whatsapp'), value: values.whatsapp },
        { label: t('field.company'), value: values.company },
        { label: t('field.companyWebsite'), value: values.companyWebsite },
        { label: t('field.country'), value: values.country },
        { label: t('field.city'), value: values.city },
        { label: t('field.contactMethod'), value: values.contactMethod ? option('contact', values.contactMethod) : '' },
      ],
    },
    {
      title: t('review.projectOverview'),
      step: 1,
      rows: [
        { label: t('field.projectName'), value: values.projectName },
        { label: t('field.projectCategory'), value: values.projectCategory ? option('category', values.projectCategory) : '' },
        { label: t('field.projectDescription'), value: values.projectDescription },
        { label: t('field.businessIndustry'), value: values.businessIndustry },
        { label: t('field.businessStage'), value: values.businessStage ? option('stage', values.businessStage) : '' },
        { label: t('field.targetAudience'), value: values.targetAudience },
        { label: t('field.targetMarket'), value: values.targetMarket },
        { label: t('field.customerNeeds'), value: values.customerNeeds },
        { label: t('field.customerPainPoints'), value: values.customerPainPoints },
      ],
    },
    {
      title: t('review.businessGoals'),
      step: 1,
      rows: [
        { label: t('field.businessGoals'), value: join(values.businessGoals, 'goal', values.businessGoalsOther) },
        { label: t('field.problemSolved'), value: values.problemSolved },
      ],
    },
    {
      title: t('review.requirements'),
      step: 2,
      rows: [
        { label: t('field.features'), value: join(values.features, 'feature', values.featuresOther) },
        { label: t('field.featureRequirements'), value: values.featureRequirements },
        { label: t('field.expectedPages'), value: values.expectedPages },
        { label: t('field.userRoles'), value: values.userRoles },
        { label: t('field.existingIntegrations'), value: values.existingIntegrations },
        { label: t('field.requiredLanguages'), value: values.requiredLanguages },
        { label: t('field.expectedTraffic'), value: values.expectedTraffic },
        { label: t('field.contentManagement'), value: values.contentManagement },
        { label: t('field.futureExpansion'), value: values.futureExpansion },
        { label: t('field.technicalConstraints'), value: values.technicalConstraints },
      ],
    },
    {
      title: t('review.design'),
      step: 3,
      rows: [
        { label: t('field.hasLogo'), value: values.hasLogo ? option('ynu', values.hasLogo) : '' },
        { label: t('field.hasBrandGuidelines'), value: values.hasBrandGuidelines ? option('ynu', values.hasBrandGuidelines) : '' },
        { label: t('field.brandColors'), value: values.brandColors },
        { label: t('field.preferredTypography'), value: values.preferredTypography },
        { label: t('field.existingDesignAssets'), value: values.existingDesignAssets },
        { label: t('field.mediaAvailability'), value: values.mediaAvailability ? option('ynu', values.mediaAvailability) : '' },
        {
          label: t('field.designDirections'),
          value: join(values.designDirections, 'design', values.designDirectionOther),
        },
        { label: t('field.inspiration1'), value: values.inspiration1 },
        { label: t('field.inspiration2'), value: values.inspiration2 },
        { label: t('field.competitor1'), value: values.competitor1 },
        { label: t('field.competitor2'), value: values.competitor2 },
        { label: t('field.designLikes'), value: values.designLikes },
        { label: t('field.designAvoid'), value: values.designAvoid },
        { label: t('field.designNotes'), value: values.designNotes },
        { label: t('section.files'), value: (values.fileLinks ?? []).filter(Boolean).join(', ') },
      ],
    },
    {
      title: t('review.budget'),
      step: 4,
      rows: [
        { label: t('field.budget'), value: values.budget ? option('budget', values.budget) : '' },
        { label: t('field.startDate'), value: values.startDate },
        { label: t('field.launchDate'), value: values.launchDate },
        { label: t('field.timelineFlexibility'), value: values.timelineFlexibility ? option('flexibility', values.timelineFlexibility) : '' },
        { label: t('field.urgency'), value: values.urgency ? option('urgency', values.urgency) : '' },
        { label: t('field.hasExistingProject'), value: values.hasExistingProject ? option('ynu', values.hasExistingProject) : '' },
        { label: t('field.migrationRequired'), value: values.migrationRequired ? option('ynu', values.migrationRequired) : '' },
        { label: t('field.ongoingMaintenance'), value: values.ongoingMaintenance ? option('ynu', values.ongoingMaintenance) : '' },
        { label: t('field.hostingSupport'), value: values.hostingSupport ? option('ynu', values.hostingSupport) : '' },
        { label: t('field.postLaunchSupport'), value: values.postLaunchSupport ? option('ynu', values.postLaunchSupport) : '' },
      ],
    },
  ];

  return (
    <>
      {formState.submitCount > 0 && errors.confirmAccurate ? (
        <motion.p
          initial={{ opacity: 0, y: -6 }}
          animate={{ opacity: 1, y: 0 }}
          className="rounded-xl border border-danger/40 bg-danger/5 px-4 py-3 text-[13px] text-danger"
          role="alert"
        >
          {t('validation.review')}
        </motion.p>
      ) : null}

      <div className="flex flex-col gap-5">
        {groups.map((group) => (
          <ReviewCard
            key={group.title}
            title={group.title}
            rows={group.rows}
            onEdit={() => onEdit(group.step)}
            editLabel={t('common.reviewEdit')}
          />
        ))}
      </div>

      <div className="flex flex-col gap-4 border-t border-hair pt-8">
        <h3 className="font-mono text-[11px] uppercase tracking-[0.22em] text-faint">{t('review.consent')}</h3>

        <Checkbox
          label={t('review.confirmText')}
          error={errors.confirmAccurate?.message}
          {...register('confirmAccurate')}
        />
        <Checkbox
          label={
            <>
              {t('review.privacyText')}{' '}
              <a
                href={privacyUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="text-ink underline underline-offset-4 hover:text-mute"
              >
                {t('review.privacyLink')}
              </a>
              .
            </>
          }
          error={errors.privacyAck?.message}
          {...register('privacyAck')}
        />
        <Checkbox label={t('review.marketingText')} {...register('marketingConsent')} />

        <p className="mt-2 text-[12.5px] text-faint">{t('review.submitHint')}</p>
      </div>
    </>
  );
}
