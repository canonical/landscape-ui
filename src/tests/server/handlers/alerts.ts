import { http, HttpResponse } from "msw";
import { API_URL, API_URL_OLD } from "@/constants";
import { Alert, AlertSummaryResponse } from "@/types/Alert";
import { alerts, alertsSummary } from "@/tests/mocks/alerts";
import { SubscriptionParams } from "@/hooks/useAlerts";
import { getEndpointStatus } from "@/tests/controllers/controller";
import { isAction } from "@/tests/server/handlers/_helpers";

export default [
  http.get<never, never, Alert[]>(`${API_URL}alerts`, () => {
    return HttpResponse.json(alerts);
  }),

  http.get<never, never, AlertSummaryResponse>(
    `${API_URL}alerts/summary`,
    () => {
      const endpointStatus = getEndpointStatus();

      if (endpointStatus === "empty") {
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
