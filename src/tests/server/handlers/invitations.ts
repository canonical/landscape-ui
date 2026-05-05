import { API_URL } from "@/constants";
import { getEndpointStatus } from "@/tests/controllers/controller";
import type { InvitationSummary } from "@/types/Invitation";
import { http, HttpResponse } from "msw";
import {
  generatePaginatedResponse,
  shouldApplyEndpointStatus,
} from "./_helpers";
import { invitations, invitationsSummary } from "@/tests/mocks/invitations";

export const invitationState = {
  accepted: false,
};

export default [
  http.get<never, never>(`${API_URL}invitations`, () => {
    const { status } = getEndpointStatus();

    if (status === "empty") {
      return HttpResponse.json(
        generatePaginatedResponse({
          data: [],
          limit: 20,
          offset: 0,
        }),
      );
    }

    return HttpResponse.json(
      generatePaginatedResponse({
        data: invitations,
        limit: 20,
        offset: 0,
      }),
    );
  }),

  http.get<{ id: string }, never, InvitationSummary>(
    `${API_URL}invitations/:id/summary`,
    ({ params }) => {
      return HttpResponse.json(
        invitationsSummary.find(({ secure_id }) => secure_id === params.id),
      );
    },
  ),

  http.post(`${API_URL}accept-invitation`, () => {
    if (shouldApplyEndpointStatus("accept-invitation")) {
      const { status } = getEndpointStatus();
      if (status === "error") {
        return HttpResponse.json(
          { error: "InternalServerError", message: "Accept failed" },
          { status: 500 },
        );
      }
    }
    invitationState.accepted = true;
    return HttpResponse.json({
      account_id: 4,
      account_title: "My Account",
    });
  }),

  http.post(`${API_URL}reject-invitation`, () => {
    if (shouldApplyEndpointStatus("reject-invitation")) {
      const { status } = getEndpointStatus();
      if (status === "error") {
        return HttpResponse.json(
          { error: "InternalServerError", message: "Reject failed" },
          { status: 500 },
        );
      }
    }
    return new HttpResponse(null, { status: 204 });
  }),

  http.delete(`${API_URL}invitations/:id`, () => {
    return new HttpResponse(null, { status: 204 });
  }),

  http.post(`${API_URL}invitations/:id`, () => {
    return new HttpResponse(null, { status: 200 });
  }),
];
