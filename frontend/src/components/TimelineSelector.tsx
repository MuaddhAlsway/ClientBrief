import type { FieldErrors, UseFormRegister } from 'react-hook-form';
import type { BriefFormValues } from '@/schemas/briefSchema';
import { DateInput } from './DateInput';
import { RadioCards } from './RadioCards';
import { FormSection, FieldGrid } from './FormSection';
import { useI18n } from '@/i18n/LanguageContext';
import { URGENCY_LEVELS, TIMELINE_FLEXIBILITY } from '@/types/brief';

interface TimelineSelectorProps {
  register: UseFormRegister<BriefFormValues>;
  errors: FieldErrors<BriefFormValues>;
  urgency?: string;
  onUrgency: (value: string) => void;
  flexibility?: string;
  onFlexibility: (value: string) => void;
}

export function TimelineSelector({
  register,
  errors,
  urgency,
  onUrgency,
  flexibility,
  onFlexibility,
}: TimelineSelectorProps) {
  const { t, option } = useI18n();

  const urgencyCards = URGENCY_LEVELS.map((value) => ({ value, label: option('urgency', value) }));
  const flexibilityCards = TIMELINE_FLEXIBILITY.map((value) => ({ value, label: option('flexibility', value) }));

  return (
    <FormSection title={t('section.timeline')}>
      <FieldGrid>
        <DateInput
          label={t('field.startDate')}
          optional={t('common.optional')}
          error={errors.startDate?.message}
          {...register('startDate')}
        />
        <DateInput
          label={t('field.launchDate')}
          optional={t('common.optional')}
          error={errors.launchDate?.message}
          {...register('launchDate')}
        />
      </FieldGrid>

      <div className="mt-8 flex flex-col gap-8">
        <div>
          <p className="mb-3 text-[11px] uppercase tracking-[0.14em] text-mute">{t('field.urgency')}</p>
          <RadioCards name="urgency" options={urgencyCards} value={urgency} onChange={onUrgency} columns={2} />
        </div>
        <div>
          <p className="mb-3 text-[11px] uppercase tracking-[0.14em] text-mute">
            {t('field.timelineFlexibility')} <span className="text-faint">({t('common.optional')})</span>
          </p>
          <RadioCards
            name="timelineFlexibility"
            options={flexibilityCards}
            value={flexibility}
            onChange={onFlexibility}
            columns={3}
          />
        </div>
      </div>
    </FormSection>
  );
}
