import { API_URL, API_URL_OLD } from "@/constants";
import type { AlertSummaryResponse } from "@/features/alert-notifications";
import type {
  Alert,
  AssociateAlertParams,
  DisassociateAlertParams,
  SubscriptionParams,
} from "@/features/alerts";
import { getEndpointStatus } from "@/tests/controllers/controller";
import { alerts, alertsSummary, licenseAlert } from "@/tests/mocks/alerts";
import { isAction } from "@/tests/server/handlers/_helpers";
import { http, HttpResponse } from "msw";
import { getEndpointStatusApiError } from "./_constants";

export default [
  http.get<never, never, Alert[]>(`${API_URL}alerts`, () => {
    return HttpResponse.json([...alerts, licenseAlert]);
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

  http.get<never, AssociateAlertParams, Alert>(API_URL_OLD, ({ request }) => {
    if (!isAction(request, "AssociateAlert")) {
      return;
    }
    const endpointStatus = getEndpointStatus();
    const action = new URL(request.url).searchParams.get("action");
    if (
      endpointStatus.status === "error" &&
      (!endpointStatus.path || endpointStatus.path === action)
    ) {
      throw getEndpointStatusApiError();
    }

    const [firstAlert] = alerts;

    return HttpResponse.json(firstAlert);
  }),

  http.get<never, DisassociateAlertParams, Alert>(
    API_URL_OLD,
    ({ request }) => {
      if (!isAction(request, "DisassociateAlert")) {
        return;
      }
      const endpointStatus = getEndpointStatus();
      const action = new URL(request.url).searchParams.get("action");
      if (
        endpointStatus.status === "error" &&
        (!endpointStatus.path || endpointStatus.path === action)
      ) {
        throw getEndpointStatusApiError();
      }

      const [firstAlert] = alerts;

      return HttpResponse.json(firstAlert);
    },
  ),
];
