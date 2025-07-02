import { API_URL, API_URL_OLD } from "@/constants";
import type { AlertSummaryResponse } from "@/features/alert-notifications";
import type { Alert, SubscriptionParams } from "@/features/alerts";
import { getEndpointStatus } from "@/tests/controllers/controller";
import { alerts, alertsSummary } from "@/tests/mocks/alerts";
import { isAction } from "@/tests/server/handlers/_helpers";
import { http, HttpResponse } from "msw";

export default [
  http.get<never, never, Alert[]>(`${API_URL}alerts`, () => {
    return HttpResponse.json(alerts);
  }),

  http.get<never, never, AlertSummaryResponse>(
    `${API_URL}alerts/summary`,
    () => {
      const endpointStatus = getEndpointStatus();

      if (endpointStatus.status === "empty") {
        return HttpResponse.json({
          alerts_summary: [],
        });
      }

      return HttpResponse.json({
        alerts_summary: alertsSummary,
      });
    },
  ),

  http.get<never, SubscriptionParams, undefined>(API_URL_OLD, ({ request }) => {
    if (!isAction(request, "SubscribeToAlert")) {
      return;
    }

    return HttpResponse.json();
  }),

  http.get<never, SubscriptionParams, undefined>(API_URL_OLD, ({ request }) => {
    if (!isAction(request, "UnsubscribeFromAlert")) {
      return;
    }

    return HttpResponse.json();
  }),
];
