import dayjs, { Dayjs } from 'dayjs';
import CustomParseFormat from 'dayjs/plugin/customParseFormat';
import LocalizedFormat from 'dayjs/plugin/localizedFormat';
import timezone from 'dayjs/plugin/timezone';
import utc from 'dayjs/plugin/utc';

// import relativeTime from 'dayjs/plugin/relativeTime';

import {
  DATE_FORMAT,
  DATE_TIME_FORMAT,
  HUMAN_READABLE_DATE_FORMAT,
  HUMAN_READABLE_DATE_TIME_FORMAT,
  HUMAN_READABLE_TIME_FORMAT,
  TIME_FORMAT,
} from '../constants';
import { DurationUnits } from '../graphql/generated/graphql';
import { HealthFacilityService } from '../types';

dayjs.extend(utc);
dayjs.extend(timezone);
dayjs.extend(LocalizedFormat);
dayjs.extend(CustomParseFormat);
// dayjs.extend(relativeTime);

const EAT_TIMEZONE = 'Africa/Nairobi';
export const parseDateToBackendDate = (date: Date, useDateFormat: boolean = false) => {
  return dayjs(date).format(useDateFormat ? DATE_FORMAT : DATE_TIME_FORMAT);
};

export const MAXIMUM_BOOKING_DATE = dayjs().add(1, 'year').toDate();

export const parseBackendDateToDate = (date: string) => {
  return dayjs(date, DATE_TIME_FORMAT);
};

export const formatBackendDateToHumanReadableShortDate = (date: string) => {
  return dayjs(date, DATE_FORMAT).format(HUMAN_READABLE_DATE_FORMAT);
};

export const formatBackendDateTimeToHumanReadableLongDate = (date: string) => {
  return dayjs(date, DATE_TIME_FORMAT).format(HUMAN_READABLE_DATE_TIME_FORMAT);
};

export const formatBackendDateToHumanReadableTime = (date: string) => {
  return dayjs(date, DATE_TIME_FORMAT).format(HUMAN_READABLE_TIME_FORMAT);
};

const parseTimeToEATMs = (timeStr: string): number => {
  const [h, m, s] = timeStr.split(':').map(Number);
  return dayjs().tz(EAT_TIMEZONE).hour(h).minute(m).second(s).millisecond(0).valueOf();
};

const formatEATMsToTime = (ms: number): string => {
  return dayjs(ms).tz(EAT_TIMEZONE).format(TIME_FORMAT);
};

export const generateServiceSlots = async (
  allServicesSchedules: HealthFacilityService['schedules'][],
  serviceTimes: (HealthFacilityService['duration'] | null)[],
  onLoadingChange?: (loading: boolean) => void
): Promise<HealthFacilityService['schedules']> => {
  onLoadingChange?.(true);

  try {
    await new Promise((resolve) => setTimeout(resolve, 0));

    if (!allServicesSchedules.length || allServicesSchedules.some((service) => !service.length)) {
      return [];
    }

    const serviceTimeMs = serviceTimes.reduce((max, serviceTime) => {
      if (!serviceTime?.value || !serviceTime.units) return max;
      const ms =
        serviceTime.units === DurationUnits.Days
          ? serviceTime.value * 86400000
          : serviceTime.units === DurationUnits.Hours
            ? serviceTime.value * 3600000
            : serviceTime.units === DurationUnits.Minutes
              ? serviceTime.value * 60000
              : serviceTime.units === DurationUnits.Seconds
                ? serviceTime.value * 1000
                : 0;
      return Math.max(max, ms);
    }, 0);

    if (serviceTimeMs <= 0) return [];

    const serviceAvailabilities = allServicesSchedules.map((serviceSchedules) => {
      const byDay: Record<number, { start: number; end: number }[]> = {};
      serviceSchedules.forEach((schedule) => {
        if (!schedule.startTime || !schedule.endTime || schedule.dayOfTheWeek == null) return;
        const start = parseTimeToEATMs(schedule.startTime);
        const end = parseTimeToEATMs(schedule.endTime);
        if (start >= end) return;
        const day = schedule.dayOfTheWeek;
        if (!byDay[day]) byDay[day] = [];
        byDay[day].push({ start, end });
      });
      return byDay;
    });

    await new Promise((resolve) => setTimeout(resolve, 0));

    const allSlots: HealthFacilityService['schedules'] = [];
    const currentDate = dayjs().tz(EAT_TIMEZONE);
    const currentDayOfWeek = currentDate.day();
    const currentTimeMs = parseTimeToEATMs(currentDate.format(DATE_TIME_FORMAT));

    const allDays = serviceAvailabilities.flatMap((service) => Object.keys(service).map(Number));
    const commonDays = Array.from(new Set(allDays)).filter((day) =>
      serviceAvailabilities.every((service) => day in service)
    );

    for (let i = 0; i < commonDays.length; i++) {
      const day = commonDays[i];
      const dayRanges = serviceAvailabilities.map((service) => service[day]);
      const commonStart = Math.max(
        ...dayRanges.map((ranges) => Math.min(...ranges.map((r) => r.start)))
      );
      const commonEnd = Math.min(
        ...dayRanges.map((ranges) => Math.max(...ranges.map((r) => r.end)))
      );

      if (commonStart >= commonEnd) continue;

      for (let time = commonStart; time + serviceTimeMs <= commonEnd; time += serviceTimeMs) {
        if (day === currentDayOfWeek && time < currentTimeMs) {
          continue;
        }
        allSlots.push({
          startTime: formatEATMsToTime(time),
          endTime: formatEATMsToTime(time + serviceTimeMs),
          dayOfTheWeek: day,
        });
      }

      if (i % 2 === 0) {
        await new Promise((resolve) => setTimeout(resolve, 0));
      }
    }

    return allSlots;
  } finally {
    onLoadingChange?.(false);
  }
};

export const replaceTimeInDateTime = (date: Date, time: string) => {
  const datePart = dayjs(date).utc().format(DATE_FORMAT);
  const combined = dayjs.utc(`${datePart}T${time}`);
  return combined.toDate();
};

export const CURRENT_DATE_TIME = dayjs().tz(EAT_TIMEZONE).toDate();

export const getTimeDifferenceInMinutes = (endTime: string, startTime: string): number => {
  return dayjs(`${'2025-01-01'}T${endTime}`).diff(dayjs(`${'2025-01-01'}T${startTime}`), 'minute');
};

export const getTimeSince = (time: Dayjs) => {
  const now = dayjs();
  const diff = now.diff(time, 'minute');

  if (diff >= 43830) {
    const months = Math.floor(diff / 43830);
    return `${months}mo ago`;
  } else if (diff >= 10080) {
    const weeks = Math.floor(diff / 10080);
    return `${weeks}w ago`;
  } else if (diff >= 1440) {
    const days = Math.floor(diff / 1440);
    return `${days}d ago`;
  } else if (diff >= 60) {
    const hours = Math.floor(diff / 60);
    return `${hours}h ago`;
  } else if (diff >= 1) {
    return `${diff}m ago`;
  } else {
    return 'now';
  }
};
