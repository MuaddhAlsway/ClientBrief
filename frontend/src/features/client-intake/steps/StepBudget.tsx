import type { UseFormReturn } from 'react-hook-form';
import { FormSection } from '@/components/FormSection';
import { BudgetSelector } from '@/components/BudgetSelector';
import { TimelineSelector } from '@/components/TimelineSelector';
import { RadioCards } from '@/components/RadioCards';
import { useI18n } from '@/i18n/LanguageContext';
import { BUDGETS, YES_NO_UNSURE } from '@/types/brief';
import type { BriefFormValues } from '@/schemas/briefSchema';

interface StepProps {
  form: UseFormReturn<BriefFormValues>;
}

export function StepBudget({ form }: StepProps) {
  const { t, option } = useI18n();
  const { register, setValue, watch, formState } = form;

  const budget = watch('budget');
  const urgency = watch('urgency');
  const flexibility = watch('timelineFlexibility');
  const hasExistingProject = watch('hasExistingProject');
  const migrationRequired = watch('migrationRequired');
  const ongoingMaintenance = watch('ongoingMaintenance');
  const hostingSupport = watch('hostingSupport');
  const postLaunchSupport = watch('postLaunchSupport');

  const ynuOptions = YES_NO_UNSURE.map((value) => ({ value, label: option('ynu', value) }));

  const supportFields = [
    { name: 'hasExistingProject' as const, label: t('field.hasExistingProject'), value: hasExistingProject },
    { name: 'migrationRequired' as const, label: t('field.migrationRequired'), value: migrationRequired },
    { name: 'ongoingMaintenance' as const, label: t('field.ongoingMaintenance'), value: ongoingMaintenance },
    { name: 'hostingSupport' as const, label: t('field.hostingSupport'), value: hostingSupport },
    { name: 'postLaunchSupport' as const, label: t('field.postLaunchSupport'), value: postLaunchSupport },
  ];

  return (
    <>
      <FormSection title={t('section.budget')}>
        <BudgetSelector
          value={budget}
          onChange={(value) => setValue('budget', value as BriefFormValues['budget'], { shouldValidate: true })}
          options={BUDGETS}
        />
      </FormSection>

      <TimelineSelector
        register={register}
        errors={formState.errors}
        urgency={urgency}
        onUrgency={(value) => setValue('urgency', value as BriefFormValues['urgency'], { shouldValidate: true })}
        flexibility={flexibility}
        onFlexibility={(value) =>
          setValue('timelineFlexibility', value as BriefFormValues['timelineFlexibility'], { shouldValidate: true })
        }
      />

      <FormSection title={t('section.support')}>
        <div className="flex flex-col gap-8">
          {supportFields.map((field) => (
            <div key={field.name}>
              <p className="mb-3 text-[11px] uppercase tracking-[0.14em] text-mute">{field.label}</p>
              <RadioCards
                name={field.name}
                options={ynuOptions}
                value={field.value}
                onChange={(value) =>
                  setValue(field.name, value as BriefFormValues[typeof field.name], { shouldValidate: true })
                }
                columns={3}
              />
            </div>
          ))}
        </div>
      </FormSection>
    </>
  );
}
