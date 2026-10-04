import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const env = (envName: string): string => {
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  return import.meta.env[envName];
};

export const isNumber = (value: unknown): value is number => {
  return typeof value === 'number' && Number.isFinite(value);
};

export const getPositiveNumber = (n: number) => {
  return n > 0 ? n : 0;
};

export const formatBytes = (bytes: number, decimals = 2): string => {
  if (!Number.isFinite(bytes) || bytes < 0) return '0 B';
  if (bytes === 0) return '0 B';

  const k = 1024;
  const units = ['B', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB'];
  const i = Math.min(Math.floor(Math.log(bytes) / Math.log(k)), units.length - 1);

  const value = bytes / Math.pow(k, i);
  return `${value.toFixed(decimals)} ${units[i]}`;
};
