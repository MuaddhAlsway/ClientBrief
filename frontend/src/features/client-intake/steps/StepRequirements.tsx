import type { UseFormReturn } from 'react-hook-form';
import { FloatingLabelInput, AnimatedTextarea } from '@/components/FloatingLabelInput';
import { FormSection, FieldGrid } from '@/components/FormSection';
import { MultiSelectCards } from '@/components/MultiSelectCards';
import { RadioCards } from '@/components/RadioCards';
import { useI18n } from '@/i18n/LanguageContext';
import { FEATURES, YES_NO_UNSURE } from '@/types/brief';
import type { BriefFormValues } from '@/schemas/briefSchema';

interface StepProps {
  form: UseFormReturn<BriefFormValues>;
}

export function StepRequirements({ form }: StepProps) {
  const { t, option } = useI18n();
  const { register, setValue, watch } = form;

  const features = (watch('features') ?? []) as string[];
  const existingHosting = watch('existingHosting');
  const domainAvailability = watch('domainAvailability');

  const featureOptions = FEATURES.map((value) => ({ value, label: option('feature', value) }));
  const ynuOptions = YES_NO_UNSURE.map((value) => ({ value, label: option('ynu', value) }));

  const toggleFeature = (value: string) => {
    const next = features.includes(value) ? features.filter((item) => item !== value) : [...features, value];
    setValue('features', next as BriefFormValues['features'], { shouldValidate: true, shouldDirty: true });
  };

  const showsOtherFeature = features.includes('Other');

  return (
    <>
      <FormSection title={t('section.features')} description={t('common.chooseMany')}>
        <MultiSelectCards
          options={featureOptions}
          selected={features}
          onToggle={toggleFeature}
          legend={t('field.features')}
        />
        {showsOtherFeature ? (
          <div className="mt-5">
            <FloatingLabelInput
              label={t('field.featuresOther')}
              placeholder={t('common.otherPlaceholder')}
              {...register('featuresOther')}
            />
          </div>
        ) : null}
        <div className="mt-2">
          <AnimatedTextarea
            label={t('field.featureRequirements')}
            optional={t('common.optional')}
            rows={4}
            placeholder={t('placeholder.featureRequirements')}
            {...register('featureRequirements')}
          />
        </div>
      </FormSection>

      <FormSection title={t('section.details')}>
        <FieldGrid>
          <FloatingLabelInput
            label={t('field.expectedPages')}
            optional={t('common.optional')}
            placeholder={t('placeholder.expectedPages')}
            {...register('expectedPages')}
          />
          <FloatingLabelInput
            label={t('field.userRoles')}
            optional={t('common.optional')}
            placeholder={t('placeholder.userRoles')}
            {...register('userRoles')}
          />
          <FloatingLabelInput
            label={t('field.existingIntegrations')}
            optional={t('common.optional')}
            placeholder={t('placeholder.existingIntegrations')}
            {...register('existingIntegrations')}
          />
          <FloatingLabelInput
            label={t('field.requiredLanguages')}
            optional={t('common.optional')}
            placeholder={t('placeholder.requiredLanguages')}
            {...register('requiredLanguages')}
          />
          <FloatingLabelInput
            label={t('field.expectedTraffic')}
            optional={t('common.optional')}
            placeholder={t('placeholder.expectedTraffic')}
            {...register('expectedTraffic')}
          />
        </FieldGrid>

        <div className="mt-1 flex flex-col gap-1">
          <AnimatedTextarea
            label={t('field.contentManagement')}
            optional={t('common.optional')}
            rows={3}
            placeholder={t('placeholder.contentManagement')}
            {...register('contentManagement')}
          />
          <AnimatedTextarea
            label={t('field.futureExpansion')}
            optional={t('common.optional')}
            rows={3}
            placeholder={t('placeholder.futureExpansion')}
            {...register('futureExpansion')}
          />
        </div>
      </FormSection>

      <FormSection title={t('section.technical')} description={t('help.notSureField')}>
        <FieldGrid>
          <FloatingLabelInput
            label={t('field.preferredTechStack')}
            optional={t('common.optional')}
            placeholder={t('placeholder.preferredTechStack')}
            {...register('preferredTechStack')}
          />
        </FieldGrid>

        <div className="mt-1 grid gap-8 md:grid-cols-2">
          <div>
            <p className="mb-3 text-[11px] uppercase tracking-[0.14em] text-mute">{t('field.existingHosting')}</p>
            <RadioCards
              name="existingHosting"
              options={ynuOptions}
              value={existingHosting}
              onChange={(value) => setValue('existingHosting', value as BriefFormValues['existingHosting'], { shouldValidate: true })}
              columns={2}
              legend={t('field.existingHosting')}
            />
          </div>
          <div>
            <p className="mb-3 text-[11px] uppercase tracking-[0.14em] text-mute">{t('field.domainAvailability')}</p>
            <RadioCards
              name="domainAvailability"
              options={ynuOptions}
              value={domainAvailability}
              onChange={(value) => setValue('domainAvailability', value as BriefFormValues['domainAvailability'], { shouldValidate: true })}
              columns={2}
              legend={t('field.domainAvailability')}
            />
          </div>
        </div>

        <div className="mt-2 flex flex-col gap-1">
          <AnimatedTextarea
            label={t('field.securityRequirements')}
            optional={t('common.optional')}
            rows={3}
            {...register('securityRequirements')}
          />
          <AnimatedTextarea
            label={t('field.performanceRequirements')}
            optional={t('common.optional')}
            rows={3}
            {...register('performanceRequirements')}
          />
          <AnimatedTextarea
            label={t('field.accessibilityRequirements')}
            optional={t('common.optional')}
            rows={3}
            {...register('accessibilityRequirements')}
          />
          <AnimatedTextarea
            label={t('field.scalabilityRequirements')}
            optional={t('common.optional')}
            rows={3}
            {...register('scalabilityRequirements')}
          />
          <AnimatedTextarea
            label={t('field.technicalConstraints')}
            optional={t('common.optional')}
            rows={3}
            placeholder={t('placeholder.technicalConstraints')}
            {...register('technicalConstraints')}
          />
        </div>
      </FormSection>
    </>
  );
}
