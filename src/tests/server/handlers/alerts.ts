import { http, HttpResponse } from "msw";
import { API_URL, API_URL_OLD } from "@/constants";
import { Alert } from "@/types/Alert";
import { alerts } from "@/tests/mocks/alerts";
import { SubscriptionParams } from "@/hooks/useAlerts";

export default [
  // @ts-ignore-next-line
  http.get<undefined, never, Alert[]>(`${API_URL}alerts`, () => {
    return HttpResponse.json(alerts);
  }),

  http.get<never, SubscriptionParams, undefined>(
    `${API_URL_OLD}SubscribeToAlert`,
    () => {
      return HttpResponse.json();
    },
  ),

  http.get<never, SubscriptionParams, undefined>(
    `${API_URL_OLD}UnsubscribeFromAlert`,
    () => {
      return HttpResponse.json();
    },
  ),
];
