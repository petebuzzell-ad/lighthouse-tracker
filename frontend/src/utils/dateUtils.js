import { formatInTimeZone } from 'date-fns-tz';

export function formatDateToEST(dateString) {
  return formatInTimeZone(new Date(dateString), 'America/New_York', 'yyyy-MM-dd HH:mm:ss');
}
