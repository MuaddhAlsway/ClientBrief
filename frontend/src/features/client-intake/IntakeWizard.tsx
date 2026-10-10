import { useEffect, useMemo, useRef, useState } from 'react';
import { useForm, type DefaultValues } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { AnimatePresence } from 'framer-motion';
import { ArrowLeft, ArrowRight, Loader2 } from 'lucide-react';
import toast from 'react-hot-toast';
import { Navbar } from '@/components/Navbar';
import { ProgressIndicator } from '@/components/ProgressIndicator';
import { StepLayout } from '@/components/StepLayout';
import { Button } from '@/components/ui/button';
import { useI18n } from '@/i18n/LanguageContext';
import { createBriefSchema, STEP_FIELDS, type BriefFormValues } from '@/schemas/briefSchema';
import { clearDraft, ensureSubmissionId, loadDraft, loadStep, saveDraft } from '@/lib/storage';
import { ApiError, submitBrief, type SubmitResult } from '@/lib/api';
import { StepClientInfo } from './steps/StepClientInfo';
import { StepDiscovery } from './steps/StepDiscovery';
import { StepRequirements } from './steps/StepRequirements';
import { StepDesign } from './steps/StepDesign';
import { StepBudget } from './steps/StepBudget';
import { StepReview } from './steps/StepReview';

interface IntakeWizardProps {
  onExit: () => void;
  onSuccess: (result: SubmitResult, email: string) => void;
  privacyUrl?: string;
}

function buildDefaults(locale: 'en' | 'ar', draft?: Partial<BriefFormValues>): DefaultValues<BriefFormValues> {
  const base: DefaultValues<BriefFormValues> = {
    submissionId: ensureSubmissionId(),
    website: '',
    fullName: '',
    email: '',
    phone: '',
    whatsapp: '',
    company: '',
    companyWebsite: '',
    country: '',
    city: '',
    contactMethod: 'Email',
    projectName: '',
    projectDescription: '',
    businessIndustry: '',
    businessStage: 'Existing business',
    businessGoals: [],
    businessGoalsOther: '',
    problemSolved: '',
    targetAudience: '',
    targetMarket: '',
    customerNeeds: '',
    customerPainPoints: '',
    features: [],
    featuresOther: '',
    featureRequirements: '',
    expectedPages: '',
    userRoles: '',
    existingIntegrations: '',
    requiredLanguages: '',
    expectedTraffic: '',
    futureExpansion: '',
    contentManagement: '',
    technicalConstraints: '',
    preferredTechStack: '',
    existingHosting: 'Not sure — advise me',
    domainAvailability: 'Not sure — advise me',
    securityRequirements: '',
    performanceRequirements: '',
    accessibilityRequirements: '',
    scalabilityRequirements: '',
    hasLogo: 'Not sure — advise me',
    hasBrandGuidelines: 'Not sure — advise me',
    brandColors: '',
    preferredTypography: '',
    existingDesignAssets: '',
    mediaAvailability: 'Not sure — advise me',
    designDirections: [],
    designDirectionOther: '',
    inspiration1: '',
    inspiration2: '',
    inspiration3: '',
    competitor1: '',
    competitor2: '',
    designLikes: '',
    designAvoid: '',
    designNotes: '',
    fileLinks: [],
    budget: "Let's discuss",
    startDate: '',
    launchDate: '',
    urgency: 'Normal',
    hasExistingProject: 'No',
    migrationRequired: 'Not sure — advise me',
    ongoingMaintenance: 'Not sure — advise me',
    hostingSupport: 'Not sure — advise me',
    postLaunchSupport: 'Not sure — advise me',
    confirmAccurate: false,
    privacyAck: false,
    marketingConsent: false,
    locale,
  };
  return { ...base, ...(draft ?? {}) };
}

export function IntakeWizard({ onExit, onSuccess, privacyUrl }: IntakeWizardProps) {
  const { t, locale } = useI18n();
  const [draft] = useState(() => loadDraft()?.values);
  const [step, setStep] = useState(() => loadStep());
  const [submitting, setSubmitting] = useState(false);
  const stepRef = useRef(step);
  stepRef.current = step;

  const schema = useMemo(() => createBriefSchema(t), [t]);

  const form = useForm<BriefFormValues>({
    resolver: zodResolver(schema),
    mode: 'onTouched',
    defaultValues: buildDefaults(locale, draft),
  });

  // Autosave to localStorage (debounced) whenever any value changes.
  useEffect(() => {
    let timer: number | undefined;
    const subscription = form.watch(() => {
      window.clearTimeout(timer);
      timer = window.setTimeout(() => saveDraft(form.getValues(), stepRef.current), 500);
    });
    return () => {
      window.clearTimeout(timer);
      subscription.unsubscribe();
    };
  }, [form]);

  const scrollTop = () => window.scrollTo({ top: 0, behavior: 'smooth' });

  const labels = [1, 2, 3, 4, 5, 6].map((index) => t(`steps.${index}.label` as never));

  const goTo = (next: number) => {
    setStep(next);
    scrollTop();
  };

  const handleNext = async () => {
    const fields = STEP_FIELDS[(step + 1) as 1 | 2 | 3 | 4 | 5 | 6] as unknown as (keyof BriefFormValues)[];
    const valid = await form.trigger(fields);
    if (!valid) {
      const firstError = Object.keys(form.formState.errors)[0];
      if (firstError) {
        const element = document.querySelector(`[name="${firstError}"]`) as HTMLElement | null;
        element?.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
      return;
    }
    goTo(Math.min(step + 1, 5));
  };

  const handleBack = () => {
    if (step === 0) {
      onExit();
      return;
    }
    goTo(step - 1);
  };

  const handleSubmit = form.handleSubmit(
    async (data) => {
      if (submitting) return;
      setSubmitting(true);
      try {
        const payload = { ...data, locale } as BriefFormValues;
        const result = await submitBrief(payload);
        clearDraft();
        onSuccess(result, data.email);
      } catch (error) {
        if (error instanceof ApiError) {
          if (error.status === 0) {
            toast.error(t('error.network'));
          } else if (error.fieldErrors) {
            for (const [field, message] of Object.entries(error.fieldErrors)) {
              form.setError(field as keyof BriefFormValues, { type: 'server', message });
            }
            toast.error(t('error.validation'));
          } else {
            toast.error(error.message || t('error.generic'));
          }
        } else {
          toast.error(t('error.generic'));
        }
        setSubmitting(false);
      }
    },
    () => {
      toast.error(t('validation.review'));
      scrollTop();
    },
  );

  const renderStep = () => {
    switch (step) {
      case 0:
        return <StepClientInfo form={form} />;
      case 1:
        return <StepDiscovery form={form} />;
      case 2:
        return <StepRequirements form={form} />;
      case 3:
        return <StepDesign form={form} />;
      case 4:
        return <StepBudget form={form} />;
      default:
        return <StepReview form={form} onEdit={goTo} privacyUrl={privacyUrl} />;
    }
  };

  const isLast = step === 5;

  return (
    <div className="relative min-h-[100dvh]">
      <Navbar variant="solid" onStart={onExit} showActions={false} />

      <main className="shell pb-24 pt-10">
        <div className="mb-12">
          <ProgressIndicator labels={labels} current={step} onStepClick={goTo} />
        </div>

        <form onSubmit={(event) => event.preventDefault()} noValidate>
          {/* Honeypot: hidden from users and assistive tech. */}
          <div className="absolute -left-[9999px] top-auto h-px w-px overflow-hidden" aria-hidden="true">
            <label htmlFor="website">Website</label>
            <input id="website" tabIndex={-1} autoComplete="off" {...form.register('website')} />
          </div>

          <AnimatePresence mode="wait">
            <StepLayout
              key={step}
              title={t(`steps.${step + 1}.title` as never)}
              description={t(`steps.${step + 1}.desc` as never)}
            >
              {renderStep()}
            </StepLayout>
          </AnimatePresence>
        </form>
      </main>

      <div className="sticky bottom-0 z-30 border-t border-hair bg-base/90 backdrop-blur-md safe-bottom">
        <div className="shell flex items-center justify-between gap-4 py-4">
          <Button variant="ghost" onClick={handleBack} className="group" disabled={submitting}>
            <ArrowLeft
              className="h-4 w-4 transition-transform duration-300 group-hover:-translate-x-1 rtl:rotate-180 rtl:group-hover:translate-x-1"
              aria-hidden
            />
            {t('common.back')}
          </Button>

          <span className="hidden font-mono text-[11px] tracking-[0.14em] text-faint sm:inline">
            {t('common.saved')}
          </span>

          {isLast ? (
            <Button
              type="submit"
              size="lg"
              onClick={handleSubmit}
              disabled={submitting}
              className="group min-w-[220px]"
            >
              {submitting ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" aria-hidden />
                  {t('common.sending')}
                </>
              ) : (
                <>
                  {t('common.submit')}
                  <ArrowRight
                    className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1 rtl:rotate-180 rtl:group-hover:-translate-x-1"
                    aria-hidden
                  />
                </>
              )}
            </Button>
          ) : (
            <Button variant="primary" onClick={handleNext} className="group">
              {t('common.continue')}
              <ArrowRight
                className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1 rtl:rotate-180 rtl:group-hover:-translate-x-1"
                aria-hidden
              />
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}
