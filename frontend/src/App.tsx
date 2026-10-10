import { useCallback, useState } from 'react';
import { Toaster } from 'react-hot-toast';
import { Landing } from '@/pages/Landing';
import { IntakeWizard } from '@/features/client-intake/IntakeWizard';
import { SuccessScreen } from '@/components/SuccessScreen';
import { clearDraft } from '@/lib/storage';
import type { SubmitResult } from '@/lib/api';

type View = 'landing' | 'intake' | 'success';

interface SubmissionState {
  referenceId: string;
  email: string;
  submittedAt: string;
}

const PRIVACY_URL = (import.meta.env.VITE_PRIVACY_URL as string | undefined) || '/privacy.html';

export default function App() {
  const [view, setView] = useState<View>('landing');
  const [submission, setSubmission] = useState<SubmissionState | null>(null);

  const start = useCallback(() => {
    setView('intake');
    window.scrollTo({ top: 0 });
  }, []);

  const exit = useCallback(() => {
    setView('landing');
    window.scrollTo({ top: 0 });
  }, []);

  const handleSuccess = useCallback((result: SubmitResult, email: string) => {
    setSubmission({
      referenceId: result.referenceId,
      email,
      submittedAt: new Date().toISOString(),
    });
    setView('success');
    window.scrollTo({ top: 0 });
  }, []);

  const returnHome = useCallback(() => {
    clearDraft();
    setSubmission(null);
    setView('landing');
    window.scrollTo({ top: 0 });
  }, []);

  return (
    <div className="grain relative min-h-[100dvh] bg-base">
      {view === 'landing' ? <Landing onStart={start} privacyUrl={PRIVACY_URL} /> : null}
      {view === 'intake' ? <IntakeWizard onExit={exit} onSuccess={handleSuccess} privacyUrl={PRIVACY_URL} /> : null}
      {view === 'success' && submission ? (
        <SuccessScreen
          referenceId={submission.referenceId}
          email={submission.email}
          submittedAt={submission.submittedAt}
          onReturnHome={returnHome}
        />
      ) : null}

      <Toaster
        position="top-center"
        toastOptions={{
          style: {
            background: '#111111',
            color: '#FFFFFF',
            border: '1px solid #262626',
            borderRadius: '12px',
            fontSize: '13.5px',
          },
          error: { iconTheme: { primary: '#F87171', secondary: '#111111' } },
        }}
      />
    </div>
  );
}
