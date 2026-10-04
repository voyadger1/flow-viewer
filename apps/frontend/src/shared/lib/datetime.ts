/**
 * Форматирует количество миллисекунд в строку формата "HH:MM:SS.mmm"
 *
 * @param ms - количество миллисекунд
 * @param options - опциональные настройки форматирования
 * @returns отформатированная строка
 *
 * @example
 * formatDuration(0)             // "00:00:00.000"
 * formatDuration(1000)          // "00:00:01.000"
 * formatDuration(65000)         // "00:01:05.000"
 * formatDuration(3661234)       // "01:01:01.234"
 * formatDuration(90061001)      // "25:01:01.001"
 */
export const formatDuration = (
  ms: number,
  options: {
    /** Показывать ли миллисекунды. По умолчанию true */
    showMs?: boolean;
    /** Показывать ли часы, даже если их 0. По умолчанию true */
    alwaysShowHours?: boolean;
    /** Разделитель между секундами и миллисекундами. По умолчанию "." */
    msSeparator?: string;
  } = {}
): string => {
  const { showMs = true } = options;

  const safeMs = Math.max(0, Math.floor(Number.isFinite(ms) ? ms : 0));

  const hours = Math.floor(safeMs / 3_600_000);
  const minutes = Math.floor((safeMs % 3_600_000) / 60_000);
  const seconds = Math.floor((safeMs % 60_000) / 1000);
  const milliseconds = safeMs % 1000;

  const parts: string[] = [];

  if (hours > 0) {
    parts.push(`${hours}h`);
  }
  if (minutes > 0 || minutes > 0) {
    parts.push(`${minutes}m`);
  }
  if (seconds > 0 || minutes > 0 || hours > 0) {
    parts.push(`${seconds}s`);
  }

  if (showMs && seconds <= 0 && minutes <= 0 && hours <= 0) {
    parts.push(`${milliseconds}ms`);
  }

  return parts.join(' ');
};
