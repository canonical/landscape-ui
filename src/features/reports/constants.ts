export const USN_FIXED_IN_2_DAYS = 2;
export const USN_FIXED_IN_14_DAYS = 14;
export const USN_FIXED_IN_30_DAYS = 30;
export const USN_FIXED_IN_60_DAYS = 60;

export const USN_FIXED_IN_DAYS = [
  USN_FIXED_IN_2_DAYS,
  USN_FIXED_IN_14_DAYS,
  USN_FIXED_IN_30_DAYS,
  USN_FIXED_IN_60_DAYS,
] as const;

export type UsnFixedInDays = (typeof USN_FIXED_IN_DAYS)[number];
