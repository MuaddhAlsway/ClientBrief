import type { UseFormReturn } from 'react-hook-form';
import { FloatingLabelInput, AnimatedTextarea } from '@/components/FloatingLabelInput';
import { CustomSelect } from '@/components/CustomSelect';
import { FormSection, FieldGrid } from '@/components/FormSection';
import { MultiSelectCards } from '@/components/MultiSelectCards';
import { RadioCards } from '@/components/RadioCards';
import { useI18n } from '@/i18n/LanguageContext';
import { BUSINESS_GOALS, BUSINESS_STAGES, PROJECT_CATEGORIES } from '@/types/brief';
import type { BriefFormValues } from '@/schemas/briefSchema';

interface StepProps {
  form: UseFormReturn<BriefFormValues>;
}

export function StepDiscovery({ form }: StepProps) {
  const { t, option } = useI18n();
  const {
    register,
    setValue,
    watch,
    formState: { errors },
  } = form;

  const goals = (watch('businessGoals') ?? []) as string[];
  const businessStage = watch('businessStage');

  const categoryOptions = PROJECT_CATEGORIES.map((value) => ({ value, label: option('category', value) }));
  const goalOptions = BUSINESS_GOALS.map((value) => ({ value, label: option('goal', value) }));
  const stageOptions = BUSINESS_STAGES.map((value) => ({ value, label: option('stage', value) }));

  const toggleGoal = (value: string) => {
    const next = goals.includes(value) ? goals.filter((item) => item !== value) : [...goals, value];
    setValue('businessGoals', next as BriefFormValues['businessGoals'], { shouldValidate: true, shouldDirty: true });
  };

  const showsOtherGoal = goals.includes('Other');

  return (
    <>
      <FormSection title={t('section.project')}>
        <FieldGrid>
          <FloatingLabelInput
            label={t('field.projectName')}
            placeholder={t('placeholder.projectName')}
            error={errors.projectName?.message}
            {...register('projectName')}
          />
          <CustomSelect
            label={t('field.projectCategory')}
            placeholder={t('common.selectPlaceholder')}
            options={categoryOptions}
            error={errors.projectCategory?.message}
            defaultValue=""
            {...register('projectCategory')}
          />
        </FieldGrid>

        <div className="mt-1">
          <AnimatedTextarea
            label={t('field.projectDescription')}
            rows={5}
            placeholder={t('placeholder.projectDescription')}
            error={errors.projectDescription?.message}
            {...register('projectDescription')}
          />
        </div>

        <div className="mt-1">
          <FloatingLabelInput
            label={t('field.businessIndustry')}
            optional={t('common.optional')}
            placeholder={t('placeholder.businessIndustry')}
            error={errors.businessIndustry?.message}
            {...register('businessIndustry')}
          />
        </div>

        <div className="mt-8">
          <p className="mb-3 text-[11px] uppercase tracking-[0.14em] text-mute">{t('field.businessStage')}</p>
          <RadioCards
            name="businessStage"
            options={stageOptions}
            value={businessStage}
            onChange={(value) => setValue('businessStage', value as BriefFormValues['businessStage'], { shouldValidate: true })}
          />
        </div>
      </FormSection>

      <FormSection title={t('section.goals')} description={t('common.chooseMany')}>
        <MultiSelectCards options={goalOptions} selected={goals} onToggle={toggleGoal} legend={t('field.businessGoals')} />
        {showsOtherGoal ? (
          <div className="mt-5">
            <FloatingLabelInput
              label={t('field.businessGoalsOther')}
              placeholder={t('common.otherPlaceholder')}
              {...register('businessGoalsOther')}
            />
          </div>
        ) : null}

        <div className="mt-2">
          <AnimatedTextarea
            label={t('field.problemSolved')}
            optional={t('common.optional')}
            rows={3}
            placeholder={t('placeholder.problemSolved')}
            error={errors.problemSolved?.message}
            {...register('problemSolved')}
          />
        </div>
      </FormSection>

      <FormSection title={t('section.audience')}>
        <div className="flex flex-col gap-1">
          <FieldGrid>
            <FloatingLabelInput
              label={t('field.targetAudience')}
              optional={t('common.optional')}
              placeholder={t('placeholder.targetAudience')}
              {...register('targetAudience')}
            />
            <FloatingLabelInput
              label={t('field.targetMarket')}
              optional={t('common.optional')}
              placeholder={t('placeholder.targetMarket')}
              {...register('targetMarket')}
            />
          </FieldGrid>
          <AnimatedTextarea
            label={t('field.customerNeeds')}
            optional={t('common.optional')}
            rows={3}
            placeholder={t('placeholder.customerNeeds')}
            {...register('customerNeeds')}
          />
          <AnimatedTextarea
            label={t('field.customerPainPoints')}
            optional={t('common.optional')}
            rows={3}
            placeholder={t('placeholder.customerPainPoints')}
            {...register('customerPainPoints')}
          />
        </div>
      </FormSection>
    </>
  );
}
