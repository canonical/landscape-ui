import { API_URL } from "@/constants";
import server from "@/tests/server";
import { http, HttpResponse } from "msw";

/** Overrides the plan delete handler and returns the IDs it receives. */
export const mockDeletePackageChangePlan = (): string[] => {
  const deletedIds: string[] = [];

  server.use(
    http.delete<{ id: string }>(
      `${API_URL}package-change-plans/:id`,
      ({ params }) => {
        deletedIds.push(params.id);
        return HttpResponse.json();
      },
    ),
  );

  return deletedIds;
};
