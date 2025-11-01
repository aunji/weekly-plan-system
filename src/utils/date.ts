import { format, getISOWeek, getYear, startOfWeek, endOfWeek, addDays } from 'date-fns';
import { toZonedTime, fromZonedTime } from 'date-fns-tz';

const BANGKOK_TIMEZONE = 'Asia/Bangkok';

/**
 * Get current date in Bangkok timezone
 */
export const getBangkokDate = (): Date => {
  return toZonedTime(new Date(), BANGKOK_TIMEZONE);
};

/**
 * Format date to Bangkok timezone string
 */
export const formatBangkokDate = (date: Date, formatStr: string): string => {
  const bangkokDate = toZonedTime(date, BANGKOK_TIMEZONE);
  return format(bangkokDate, formatStr);
};

/**
 * Get week identifier (YYYY-WW format) for a given date in Bangkok timezone
 * @example "2024-W45"
 */
export const getWeekIdentifier = (date: Date = new Date()): string => {
  const bangkokDate = toZonedTime(date, BANGKOK_TIMEZONE);
  const year = getYear(bangkokDate);
  const week = getISOWeek(bangkokDate);
  return `${year}-W${week.toString().padStart(2, '0')}`;
};

/**
 * Get start and end dates for a week identifier
 */
export const getWeekRange = (weekIdentifier: string): { start: Date; end: Date } => {
  const [yearStr, weekStr] = weekIdentifier.split('-W');
  const year = parseInt(yearStr, 10);
  const week = parseInt(weekStr, 10);

  // Create a date for the first day of the year
  const firstDayOfYear = new Date(year, 0, 1);
  const bangkokFirstDay = toZonedTime(firstDayOfYear, BANGKOK_TIMEZONE);

  // Calculate the start of the target week
  const daysToAdd = (week - 1) * 7;
  const targetDate = addDays(bangkokFirstDay, daysToAdd);

  const weekStart = startOfWeek(targetDate, { weekStartsOn: 1 }); // Monday
  const weekEnd = endOfWeek(targetDate, { weekStartsOn: 1 }); // Sunday

  return {
    start: weekStart,
    end: weekEnd,
  };
};

/**
 * Get array of dates for Monday-Friday of a given week
 */
export const getWeekdayDates = (weekIdentifier: string): string[] => {
  const { start } = getWeekRange(weekIdentifier);
  const dates: string[] = [];

  // Monday to Friday (0-4)
  for (let i = 0; i < 5; i++) {
    const date = addDays(start, i);
    dates.push(format(date, 'yyyy-MM-dd'));
  }

  return dates;
};

/**
 * Format timestamp for display in Bangkok timezone
 */
export const formatTimestamp = (date: Date): string => {
  return formatBangkokDate(date, 'yyyy-MM-dd HH:mm:ss');
};

/**
 * Convert local date to Bangkok timezone
 */
export const toBangkokTime = (date: Date): Date => {
  return fromZonedTime(date, BANGKOK_TIMEZONE);
};

/**
 * Get current week identifier in Bangkok timezone
 */
export const getCurrentWeekIdentifier = (): string => {
  return getWeekIdentifier(getBangkokDate());
};

/**
 * Parse week identifier to human-readable format
 * @example "2024-W45" => "Week 45, 2024"
 */
export const formatWeekIdentifier = (weekIdentifier: string): string => {
  const [year, week] = weekIdentifier.split('-W');
  return `Week ${week}, ${year}`;
};

/**
 * Check if a date is today (Bangkok timezone)
 */
export const isToday = (date: Date): boolean => {
  const today = getBangkokDate();
  const checkDate = toZonedTime(date, BANGKOK_TIMEZONE);

  return (
    format(today, 'yyyy-MM-dd') === format(checkDate, 'yyyy-MM-dd')
  );
};
