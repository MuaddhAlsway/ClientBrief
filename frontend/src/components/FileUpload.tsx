import { Plus, Link2, X, Upload } from 'lucide-react';
import { useI18n } from '@/i18n/LanguageContext';
import { cn } from '@/lib/utils';

interface FileUploadProps {
  values: string[];
  onChange: (values: string[]) => void;
  max?: number;
}

const STORAGE_ENABLED = (import.meta.env.VITE_STORAGE_ENABLED as string | undefined) === 'true';

export function FileUpload({ values, onChange, max = 10 }: FileUploadProps) {
  const { t } = useI18n();

  const update = (index: number, value: string) => {
    const next = [...values];
    next[index] = value;
    onChange(next);
  };

  const add = () => {
    if (values.length >= max) return;
    onChange([...values, '']);
  };

  const remove = (index: number) => {
    onChange(values.filter((_, i) => i !== index));
  };

  return (
    <div className="flex flex-col gap-3">
      {STORAGE_ENABLED ? (
        <label className="flex cursor-pointer items-center gap-3 rounded-xl border border-dashed border-hair bg-card px-4 py-5 text-[13.5px] text-mute transition-colors hover:border-faint">
          <Upload className="h-4 w-4" aria-hidden />
          <span>{t('files.add')}</span>
          <input type="file" className="sr-only" multiple accept="image/*,.pdf" />
        </label>
      ) : null}

      {values.map((value, index) => (
        <div key={index} className="flex items-center gap-2">
          <div className="relative flex-1">
            <Link2 className="pointer-events-none absolute start-4 top-1/2 h-4 w-4 -translate-y-1/2 text-faint" aria-hidden />
            <input
              type="url"
              value={value}
              onChange={(event) => update(index, event.target.value)}
              placeholder={t('files.placeholder')}
              className="h-12 w-full rounded-xl border border-hair bg-elevated px-4 ps-11 text-[14px] text-ink outline-none transition-colors hover:border-faint focus:border-ink"
            />
          </div>
          <button
            type="button"
            onClick={() => remove(index)}
            aria-label={t('files.remove')}
            className="flex h-12 w-12 flex-none items-center justify-center rounded-xl border border-hair text-faint transition-colors hover:border-danger/60 hover:text-danger"
          >
            <X className="h-4 w-4" aria-hidden />
          </button>
        </div>
      ))}

      <button
        type="button"
        onClick={add}
        disabled={values.length >= max}
        className={cn(
          'inline-flex w-fit items-center gap-2 rounded-xl border border-hair px-4 py-2.5 text-[13px] text-mute transition-colors hover:border-faint hover:text-ink',
          values.length >= max && 'pointer-events-none opacity-40',
        )}
      >
        <Plus className="h-4 w-4" aria-hidden />
        {values.length === 0 ? t('files.add') : t('files.addAnother')}
      </button>

      <p className="text-[12px] leading-relaxed text-faint">{t('files.hint')}</p>
    </div>
  );
}
