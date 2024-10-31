import { http, HttpResponse } from "msw";
import { API_URL } from "@/constants";
import { GetInvitationSummaryParams } from "@/features/auth";
import { InvitationSummary } from "@/types/Invitation";
import { invitationSummary } from "@/tests/mocks/invitation";

export default [
  http.get<never, GetInvitationSummaryParams, InvitationSummary>(
    `${API_URL}invitations/:invitationId/summary`,
    () => {
      return HttpResponse.json(invitationSummary);
    },
  ),
];
