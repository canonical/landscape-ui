import { API_URL } from "@/constants";
import { getEndpointStatus } from "@/tests/controllers/controller";
import type { ApiPaginatedResponse } from "@/types/api/ApiPaginatedResponse";
import type { Invitation, InvitationSummary } from "@/types/Invitation";
import { http, HttpResponse } from "msw";
import { generatePaginatedResponse } from "./_helpers";
import { invitations, invitationsSummary } from "@/tests/mocks/invitations";

export default [
  http.get<never, never, ApiPaginatedResponse<Invitation>>(
    `${API_URL}invitations`,
    () => {
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
    },
  ),

  http.get<{ id: string }, never, InvitationSummary>(
    `${API_URL}invitations/:id/summary`,
    ({ params }) => {
      return HttpResponse.json(
        invitationsSummary.find(({ secure_id }) => secure_id === params.id),
      );
    },
  ),
];
