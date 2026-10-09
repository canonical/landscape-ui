import { API_URL } from "@/constants";
import { renderWithProviders } from "@/tests/render";
import server from "@/tests/server";
import { screen, waitFor } from "@testing-library/react";
import { http, HttpResponse } from "msw";
import { describe, expect, it } from "vitest";
import type { ListPackageChangePlanItemsResponse } from "@/features/packages";
import PackagesActionSummaryDetails from "./PackagesActionSummaryDetails";

describe("PackagesActionSummaryDetails", () => {
  it("sends change-version package IDs as a JSON query parameter", async () => {
    let changeVersionParam: string | null = null;
    server.use(
      http.get(`${API_URL}package-change-plans/:id/items`, ({ request }) => {
        changeVersionParam = new URL(request.url).searchParams.get(
          "change_version",
        );

        return HttpResponse.json<ListPackageChangePlanItemsResponse>({
          action: "change_version",
          items: [],
          count: 0,
          next: "",
          previous: "",
        });
      }),
    );

    renderWithProviders(
      <PackagesActionSummaryDetails
        id={1}
        action={{
          type: "change_version",
          from_package: { id: 10, name: "example", version: "1.0" },
          to_package: { id: 20, name: "example", version: "2.0" },
        }}
      />,
    );

    await waitFor(() => {
      expect(changeVersionParam).toBe(
        JSON.stringify({ from_package_id: 10, to_package_id: 20 }),
      );
    });

    expect(screen.getByText(/no instances found/i)).toBeInTheDocument();
  });
});
