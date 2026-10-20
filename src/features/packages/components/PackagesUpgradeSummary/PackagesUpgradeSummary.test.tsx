import { API_URL } from "@/constants";
import { activities } from "@/tests/mocks/activity";
import { renderWithProviders } from "@/tests/render";
import server from "@/tests/server";
import { screen, waitFor, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { http, HttpResponse } from "msw";
import { assert, describe, expect, it, vi } from "vitest";
import type { GetPackageChangePlanSummaryResponse } from "../../api";
import PackagesUpgradeSummary from "./PackagesUpgradeSummary";

const mockSummary = (
  summary: GetPackageChangePlanSummaryResponse<"upgrade">,
) => {
  server.use(
    http.get(`${API_URL}package-change-plans/:id/summary`, () =>
      HttpResponse.json(summary),
    ),
  );
};

const mockExecute = () => {
  const executeRequests: string[] = [];

  server.use(
    http.post(`${API_URL}package-change-plans/:id\\:execute`, ({ request }) => {
      executeRequests.push(request.url);
      return HttpResponse.json(activities[0]);
    }),
  );

  return executeRequests;
};

describe("PackagesUpgradeSummary", () => {
  it("disables execution and shows an empty state when the plan has no upgrades", async () => {
    const executeRequests = mockExecute();
    const onBackButtonPress = vi.fn();
    mockSummary({ actions: [], exclusions: [] });

    renderWithProviders(
      <PackagesUpgradeSummary
        packageChangePlanId={6}
        onBackButtonPress={onBackButtonPress}
      />,
    );

    expect(await screen.findByText("No upgrades to apply")).toBeInTheDocument();
    expect(
      screen.queryByText("The following packages will be upgraded:"),
    ).not.toBeInTheDocument();
    expect(screen.queryByRole("table")).not.toBeInTheDocument();

    const submitButton = screen.getByRole("button", {
      name: "Upgrade 0 packages",
    });
    expect(submitButton).toHaveAttribute("aria-disabled", "true");

    await userEvent.click(submitButton);
    expect(executeRequests).toHaveLength(0);

    await userEvent.click(screen.getByRole("button", { name: "Back" }));
    expect(onBackButtonPress).toHaveBeenCalledOnce();
  });

  it("executes a plan with upgrades", async () => {
    const executeRequests = mockExecute();
    mockSummary({
      actions: [
        {
          action: {
            type: "upgrade",
            to_package: { id: 1, name: "qa-repro-upgrade", version: "2.0" },
          },
          computer_count: 2,
        },
      ],
      exclusions: [],
    });

    renderWithProviders(
      <PackagesUpgradeSummary
        packageChangePlanId={6}
        onBackButtonPress={() => undefined}
      />,
    );

    expect(await screen.findByText("qa-repro-upgrade")).toBeInTheDocument();
    expect(screen.queryByText("No upgrades to apply")).not.toBeInTheDocument();

    const submitButton = screen.getByRole("button", {
      name: "Upgrade 1 package",
    });
    expect(submitButton).not.toHaveAttribute("aria-disabled");

    await userEvent.click(submitButton);

    await waitFor(() => {
      expect(executeRequests).toHaveLength(1);
    });
    expect(
      await screen.findByText("You queued qa-repro-upgrade to be upgraded."),
    ).toBeInTheDocument();
  });

  it("lists packages that will not be upgraded on excluded instances", async () => {
    mockSummary({
      actions: [],
      exclusions: [
        { package_name: "qa-repro-excluded", computer_count: 2 },
        { package_name: "qa-repro-ignored", computer_count: 0 },
      ],
    });

    renderWithProviders(
      <PackagesUpgradeSummary
        packageChangePlanId={6}
        onBackButtonPress={() => undefined}
      />,
    );

    expect(await screen.findByText("No upgrades to apply")).toBeInTheDocument();

    const items = screen.getAllByRole("listitem");
    expect(items).toHaveLength(1);
    const [item] = items;
    assert(item);
    expect(within(item).getByText("qa-repro-excluded")).toBeInTheDocument();
    expect(
      within(item).getByText(/will not be upgraded on/),
    ).toBeInTheDocument();

    await userEvent.click(
      within(item).getByRole("button", { name: "2 instances" }),
    );

    expect(
      await screen.findByText("Instances not upgrading qa-repro-excluded"),
    ).toBeInTheDocument();
  });
});
