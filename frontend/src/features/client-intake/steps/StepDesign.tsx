import type { UseFormReturn } from 'react-hook-form';
import { FloatingLabelInput, AnimatedTextarea } from '@/components/FloatingLabelInput';
import { FormSection, FieldGrid } from '@/components/FormSection';
import { MultiSelectCards } from '@/components/MultiSelectCards';
import { RadioCards } from '@/components/RadioCards';
import { FileUpload } from '@/components/FileUpload';
import { useI18n } from '@/i18n/LanguageContext';
import { DESIGN_DIRECTIONS, YES_NO_UNSURE } from '@/types/brief';
import type { BriefFormValues } from '@/schemas/briefSchema';

interface StepProps {
  form: UseFormReturn<BriefFormValues>;
}

export function StepDesign({ form }: StepProps) {
  const { t, option } = useI18n();
  const {
    register,
    setValue,
    watch,
    formState: { errors },
  } = form;

  const hasLogo = watch('hasLogo');
  const hasBrandGuidelines = watch('hasBrandGuidelines');
  const mediaAvailability = watch('mediaAvailability');
  const designDirections = (watch('designDirections') ?? []) as string[];
  const fileLinks = watch('fileLinks') ?? [];

  const ynuOptions = YES_NO_UNSURE.map((value) => ({ value, label: option('ynu', value) }));
  const designOptions = DESIGN_DIRECTIONS.map((value) => ({ value, label: option('design', value) }));

  const toggleDirection = (value: string) => {
    const next = designDirections.includes(value)
      ? designDirections.filter((item) => item !== value)
      : [...designDirections, value];
    setValue('designDirections', next as BriefFormValues['designDirections'], { shouldValidate: true, shouldDirty: true });
  };

  const showsOtherDirection = designDirections.includes('Other');

  return (
    <>
      <FormSection title={t('section.branding')}>
        <div className="grid gap-8 md:grid-cols-3">
          <div>
            <p className="mb-3 text-[11px] uppercase tracking-[0.14em] text-mute">{t('field.hasLogo')}</p>
            <RadioCards
              name="hasLogo"
              options={ynuOptions}
              value={hasLogo}
              onChange={(value) => setValue('hasLogo', value as BriefFormValues['hasLogo'], { shouldValidate: true })}
              columns={2}
            />
          </div>
          <div>
            <p className="mb-3 text-[11px] uppercase tracking-[0.14em] text-mute">{t('field.hasBrandGuidelines')}</p>
            <RadioCards
              name="hasBrandGuidelines"
              options={ynuOptions}
              value={hasBrandGuidelines}
              onChange={(value) => setValue('hasBrandGuidelines', value as BriefFormValues['hasBrandGuidelines'], { shouldValidate: true })}
              columns={2}
            />
          </div>
          <div>
            <p className="mb-3 text-[11px] uppercase tracking-[0.14em] text-mute">{t('field.mediaAvailability')}</p>
            <RadioCards
              name="mediaAvailability"
              options={ynuOptions}
              value={mediaAvailability}
              onChange={(value) => setValue('mediaAvailability', value as BriefFormValues['mediaAvailability'], { shouldValidate: true })}
              columns={2}
            />
          </div>
        </div>

        <div className="mt-8 flex flex-col gap-1">
          <FieldGrid>
            <FloatingLabelInput
              label={t('field.brandColors')}
              optional={t('common.optional')}
              placeholder={t('placeholder.brandColors')}
              {...register('brandColors')}
            />
            <FloatingLabelInput
              label={t('field.preferredTypography')}
              optional={t('common.optional')}
              placeholder={t('placeholder.preferredTypography')}
              {...register('preferredTypography')}
            />
          </FieldGrid>
          <AnimatedTextarea
            label={t('field.existingDesignAssets')}
            optional={t('common.optional')}
            rows={3}
            placeholder={t('placeholder.existingDesignAssets')}
            {...register('existingDesignAssets')}
          />
        </div>
      </FormSection>

      <FormSection title={t('section.direction')} description={t('common.chooseMany')}>
        <MultiSelectCards
          options={designOptions}
          selected={designDirections}
          onToggle={toggleDirection}
          legend={t('field.designDirections')}
        />
        {showsOtherDirection ? (
          <div className="mt-5 max-w-md">
            <FloatingLabelInput label={t('field.designDirectionOther')} {...register('designDirectionOther')} />
          </div>
        ) : null}
      </FormSection>

      <FormSection title={t('section.references')}>
        <FieldGrid>
          <FloatingLabelInput label={t('field.inspiration1')} type="url" inputMode="url" optional={t('common.optional')} placeholder={t('placeholder.inspiration')} {...register('inspiration1')} />
          <FloatingLabelInput label={t('field.inspiration2')} type="url" inputMode="url" optional={t('common.optional')} placeholder={t('placeholder.inspiration')} {...register('inspiration2')} />
          <FloatingLabelInput label={t('field.inspiration3')} type="url" inputMode="url" optional={t('common.optional')} placeholder={t('placeholder.inspiration')} {...register('inspiration3')} />
          <FloatingLabelInput label={t('field.competitor1')} type="url" inputMode="url" optional={t('common.optional')} placeholder={t('placeholder.inspiration')} {...register('competitor1')} />
          <FloatingLabelInput label={t('field.competitor2')} type="url" inputMode="url" optional={t('common.optional')} placeholder={t('placeholder.inspiration')} {...register('competitor2')} />
        </FieldGrid>
      </FormSection>

      <FormSection title={t('section.notes')}>
        <div className="flex flex-col gap-1">
          <AnimatedTextarea
            label={t('field.designLikes')}
            optional={t('common.optional')}
            rows={3}
            placeholder={t('placeholder.designLikes')}
            {...register('designLikes')}
          />
          <AnimatedTextarea
            label={t('field.designAvoid')}
            optional={t('common.optional')}
            rows={3}
            placeholder={t('placeholder.designAvoid')}
            error={errors.designAvoid?.message}
            {...register('designAvoid')}
          />
          <AnimatedTextarea
            label={t('field.designNotes')}
            optional={t('common.optional')}
            rows={3}
            placeholder={t('placeholder.designNotes')}
            {...register('designNotes')}
          />
        </div>
      </FormSection>

      <FormSection title={t('section.files')}>
        <FileUpload
          values={fileLinks}
          onChange={(next) => setValue('fileLinks', next, { shouldDirty: true })}
        />
      </FormSection>
    </>
  );
}
