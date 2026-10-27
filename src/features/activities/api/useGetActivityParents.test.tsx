import { API_URL } from "@/constants";
import { renderWithProviders } from "@/tests/render";
import server from "@/tests/server";
import { screen, waitFor } from "@testing-library/react";
import { http, HttpResponse } from "msw";
import useGetActivityParents from "./useGetActivityParents";

describe("useGetActivityParents", () => {
  it.each([true, false])(
    "composes filters with URL listening %s",
    async (listenToUrlParams) => {
      const requestParams = vi.fn();
      server.use(
        http.get(`${API_URL}activities/parents`, ({ request }) => {
          requestParams(Object.fromEntries(new URL(request.url).searchParams));
          return HttpResponse.json({ results: [], count: 0 });
        }),
      );
      const Probe = () => {
        const { isGettingActivities, activitiesCount } = useGetActivityParents(
          { query: "id:10", limit: 5, offset: 2 },
          { listenToUrlParams },
        );
        return (
          <p>
            {isGettingActivities
              ? "Loading parents"
              : `Parents: ${activitiesCount}`}
          </p>
        );
      };
      renderWithProviders(
        <Probe />,
        undefined,
        "/activities?search=creator:john@example.com&query=id:20&status=failed&fromDate=2026-01-01&toDate=2026-12-01&type=ActivityGroup",
      );
      await screen.findByText("Parents: 0");
      await waitFor(() => {
        expect(requestParams).toHaveBeenLastCalledWith({
          query: listenToUrlParams
            ? "id:10 creator:john@example.com id:20 status:failed created-after:2026-01-01 created-before:2026-12-01 type:ActivityGroup"
            : "id:10",
          limit: "5",
          offset: "2",
        });
      });
    },
  );
});
