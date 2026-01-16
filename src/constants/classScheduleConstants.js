/**
 * Class Schedule Constants
 */

export const SCHEDULE_TYPE = {
  ONE_TIME: 1,
  RECURRING: 2,
};

export const SCHEDULE_TYPE_LABELS = {
  [SCHEDULE_TYPE.ONE_TIME]: 'One-time',
  [SCHEDULE_TYPE.RECURRING]: 'Recurring',
};

export const RECURRING_INTERVAL = {
  WEEKLY: 'WEEKLY',
  BI_WEEKLY: 'BI-WEEKLY',
  MONTHLY: 'MONTHLY',
};

export const RECURRING_INTERVAL_LABELS = {
  [RECURRING_INTERVAL.WEEKLY]: 'Weekly',
  [RECURRING_INTERVAL.BI_WEEKLY]: 'Bi-weekly',
  [RECURRING_INTERVAL.MONTHLY]: 'Monthly',
};

export const CLASS_DURATION_OPTIONS = [
  { label: '30 minutes', value: 30 },
  { label: '1 hour', value: 60 },
  { label: '1.5 hours', value: 90 },
  { label: '2 hours', value: 120 },
  { label: '3 hours', value: 180 },
];
