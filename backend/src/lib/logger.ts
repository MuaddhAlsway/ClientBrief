type Level = 'info' | 'warn' | 'error';

const stamp = () => new Date().toISOString();

function write(level: Level, message: string, meta?: Record<string, unknown>) {
  const line = `[${stamp()}] [${level.toUpperCase()}] ${message}`;
  if (meta && Object.keys(meta).length > 0) {
    // Meta is restricted to non-sensitive, scalar values by callers.
    console[level === 'info' ? 'log' : level](line, JSON.stringify(meta));
  } else {
    console[level === 'info' ? 'log' : level](line);
  }
}

export const logger = {
  info: (message: string, meta?: Record<string, unknown>) => write('info', message, meta),
  warn: (message: string, meta?: Record<string, unknown>) => write('warn', message, meta),
  error: (message: string, meta?: Record<string, unknown>) => write('error', message, meta),
};
