import type { UseFormReturn } from 'react-hook-form';
import { FloatingLabelInput } from '@/components/FloatingLabelInput';
import { CustomSelect } from '@/components/CustomSelect';
import { FormSection, FieldGrid } from '@/components/FormSection';
import { useI18n } from '@/i18n/LanguageContext';
import { CONTACT_METHODS, type Locale } from '@/types/brief';
import type { BriefFormValues } from '@/schemas/briefSchema';
import { translateOption } from '@/i18n/options';

interface StepProps {
  form: UseFormReturn<BriefFormValues>;
}

export function StepClientInfo({ form }: StepProps) {
  const { t, locale } = useI18n();
  const {
    register,
    formState: { errors },
  } = form;

  const contactOptions = CONTACT_METHODS.map((value) => ({
    value,
    label: translateOption('contact', value, locale as Locale),
  }));

  return (
    <>
      <FormSection title={t('section.contact')}>
        <FieldGrid>
          <FloatingLabelInput
            label={t('field.fullName')}
            placeholder={t('placeholder.fullName')}
            autoComplete="name"
            error={errors.fullName?.message}
            {...register('fullName')}
          />
          <FloatingLabelInput
            label={t('field.email')}
            type="email"
            inputMode="email"
            autoComplete="email"
            placeholder={t('placeholder.email')}
            error={errors.email?.message}
            {...register('email')}
          />
          <FloatingLabelInput
            label={t('field.phone')}
            type="tel"
            inputMode="tel"
            autoComplete="tel"
            optional={t('common.optional')}
            placeholder={t('placeholder.phone')}
            error={errors.phone?.message}
            {...register('phone')}
          />
          <FloatingLabelInput
            label={t('field.whatsapp')}
            type="tel"
            inputMode="tel"
            optional={t('common.optional')}
            placeholder={t('placeholder.phone')}
            error={errors.whatsapp?.message}
            {...register('whatsapp')}
          />
          <FloatingLabelInput
            label={t('field.company')}
            autoComplete="organization"
            placeholder={t('placeholder.company')}
            error={errors.company?.message}
            {...register('company')}
          />
          <FloatingLabelInput
            label={t('field.companyWebsite')}
            type="url"
            inputMode="url"
            optional={t('common.optional')}
            placeholder={t('placeholder.companyWebsite')}
            error={errors.companyWebsite?.message}
            {...register('companyWebsite')}
          />
        </FieldGrid>
      </FormSection>

      <FormSection title={t('section.location')}>
        <FieldGrid>
          <FloatingLabelInput
            label={t('field.country')}
            autoComplete="country-name"
            placeholder={t('placeholder.country')}
            error={errors.country?.message}
            {...register('country')}
          />
          <FloatingLabelInput
            label={t('field.city')}
            autoComplete="address-level2"
            optional={t('common.optional')}
            placeholder={t('placeholder.city')}
            error={errors.city?.message}
            {...register('city')}
          />
        </FieldGrid>

        <div className="mt-7 max-w-sm">
          <CustomSelect
            label={t('field.contactMethod')}
            options={contactOptions}
            error={errors.contactMethod?.message}
            {...register('contactMethod')}
          />
        </div>
      </FormSection>
    </>
  );
}
