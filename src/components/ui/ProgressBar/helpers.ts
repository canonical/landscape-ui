import {
  ALMOST_DONE_THRESHOLD_SECONDS,
  SECONDS_PER_HOUR,
  SECONDS_PER_MINUTE,
} from "./constants";

export const formatSecondsRemaining = (seconds: number): string => {
  const safe = Math.max(0, Math.round(seconds));

  if (safe >= SECONDS_PER_HOUR) {
    const hours = Math.floor(safe / SECONDS_PER_HOUR);
    const minutes = Math.floor((safe % SECONDS_PER_HOUR) / SECONDS_PER_MINUTE);

    return minutes ? `${hours}h ${minutes}m` : `${hours}h`;
  }

  if (safe >= SECONDS_PER_MINUTE) {
    const minutes = Math.floor(safe / SECONDS_PER_MINUTE);
    const remainderSeconds = safe % SECONDS_PER_MINUTE;

    return remainderSeconds
      ? `${minutes}m ${remainderSeconds}s`
      : `${minutes}m`;
  }

  return `${safe}s`;
};

export const getEtaLabel = (secondsRemaining: number | null): string => {
  if (secondsRemaining === null) {
    return "Estimating...";
  }

  if (secondsRemaining <= ALMOST_DONE_THRESHOLD_SECONDS) {
    return "Almost done";
  }

  return formatSecondsRemaining(secondsRemaining);
};
