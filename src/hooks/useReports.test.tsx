import { API_URL_OLD } from "@/constants";
import { setEndpointStatus } from "@/tests/controllers/controller";
import { renderWithProviders } from "@/tests/render";
import server from "@/tests/server";
import { http, HttpResponse } from "msw";
import type { FC } from "react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import useReports from "./useReports";

/**
 * Regression coverage for the empty-query guard in `useReports`.
 *
 * Every report query hook normalises its params with
 * `query: queryParams.query || undefined`, which means an empty `query`
 * string must be dropped before the request is made (an empty string would
 * be forwarded if the guard were ever changed to `?? undefined`).
 *
 * Each case renders a minimal consumer that triggers a single report hook
 * with an EMPTY query and asserts the outgoing request omits `query`.
 */

const usnTimeToFix = {
  "2": [],
  "14": [],
  "30": [],
  "60": [],
  pending: [],
};

const CsvComplianceConsumer: FC = () => {
  const { getCsvComplianceData } = useReports();
  getCsvComplianceData({ query: "" });
  return null;
};

const InstancesNotUpgradedConsumer: FC = () => {
  const { getInstancesNotUpgraded } = useReports();
  getInstancesNotUpgraded({ query: "" });
  return null;
};

const NotPingingConsumer: FC = () => {
  const { getNotPingingInstances } = useReports();
  getNotPingingInstances({ since_minutes: 5, query: "" });
  return null;
};

const UsnTimeToFixConsumer: FC = () => {
  const { getUsnTimeToFix } = useReports();
  getUsnTimeToFix({ query: "" });
  return null;
};

const UpgradedByFrequencyConsumer: FC = () => {
  const { getUpgradedInstancesByFrequency } = useReports();
  getUpgradedInstancesByFrequency({ query: "" });
  return null;
};

type JsonBody = Parameters<typeof HttpResponse.json>[0];

interface ReportCase {
  readonly action: string;
  readonly Consumer: FC;
  readonly response: JsonBody;
}

const reportCases: ReportCase[] = [
  {
    action: "GetCSVComplianceData",
    Consumer: CsvComplianceConsumer,
    response: "name,status\ninstance-1,ok",
  },
  {
    action: "GetComputersNotUpgraded",
    Consumer: InstancesNotUpgradedConsumer,
    response: [],
  },
  {
    action: "GetNotPingingComputers",
    Consumer: NotPingingConsumer,
    response: [],
  },
  {
    action: "GetUSNTimeToFix",
    Consumer: UsnTimeToFixConsumer,
    response: usnTimeToFix,
  },
  {
    action: "GetUpgradedComputersByFrequency",
    Consumer: UpgradedByFrequencyConsumer,
    response: {},
  },
];

describe("useReports empty query guard", () => {
  let capturedUrl: URL | undefined;

  beforeEach(() => {
    capturedUrl = undefined;
    setEndpointStatus("default");
  });

  it.each(reportCases)(
    "omits the query param entirely for $action when the query is empty",
    async ({ action, Consumer, response }) => {
      server.use(
        http.get(API_URL_OLD, ({ request }) => {
          const url = new URL(request.url);

          if (url.searchParams.get("action") !== action) {
            return;
          }

          capturedUrl = url;
          return HttpResponse.json(response);
        }),
      );

      renderWithProviders(<Consumer />);

      await vi.waitFor(() => {
        expect(capturedUrl).toBeDefined();
      });

      expect(capturedUrl?.searchParams.get("action")).toBe(action);
      expect(capturedUrl?.searchParams.has("query")).toBe(false);
    },
  );
});
