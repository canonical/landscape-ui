import { DISPLAY_DATE_TIME_FORMAT } from "@/constants";
import date from "@/libs/date";
import { INVITATION_LIFETIME_DAYS } from "./constants";
import type { Invitation } from "./types";

/** Returns when `invitation` expires, formatted for display. */
export const formatInvitationExpiration = (invitation: Invitation): string =>
  date(invitation.creation_time)
    .add(INVITATION_LIFETIME_DAYS, "days")
    .format(DISPLAY_DATE_TIME_FORMAT);
