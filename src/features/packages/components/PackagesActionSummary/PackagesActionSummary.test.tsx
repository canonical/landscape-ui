import { API_URL } from "@/constants";
import { activities } from "@/tests/mocks/activity";
import { http, HttpResponse } from "msw";
import { renderWithProviders } from "@/tests/render";
import server from "@/tests/server";
import { screen, waitFor, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { assert, describe, expect, it } from "vitest";
import type { GetPackageChangePlanSummaryResponse } from "../../api";
import PackagesActionSummary from "./PackagesActionSummary";

const mockSummary = (
  summary: GetPackageChangePlanSummaryResponse<"remove">,
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

const renderRemoveSummary = () =>
  renderWithProviders(
    <PackagesActionSummary
      actionType="remove"
      onBackButtonPress={() => undefined}
      packageChangePlanId={2}
    />,
  );

describe("PackagesActionSummary", () => {
  it("renders an empty state when the package change plan has no actions", async () => {
    server.use(
      http.get(`${API_URL}package-change-plans/:id/summary`, () =>
        HttpResponse.json({ actions: [], exclusions: [] }),
      ),
    );

    renderWithProviders(
      <PackagesActionSummary
        actionType="unhold"
        onBackButtonPress={() => undefined}
        packageChangePlanId={1}
      />,
    );

    expect(await screen.findByText("No changes to apply")).toBeInTheDocument();
    expect(
      screen.getByText("The package change plan is empty."),
    ).toBeInTheDocument();
    expect(screen.queryByRole("listitem")).not.toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: "Unhold 0 packages" }),
    ).toHaveAttribute("aria-disabled", "true");
  });

  it("lists fully excluded packages and disables execution when there are no actions", async () => {
    const executeRequests = mockExecute();
    mockSummary({
      actions: [],
      exclusions: [{ package_name: "qa-repro-excluded", computer_count: 2 }],
    });

    renderRemoveSummary();

    expect(await screen.findByText("No changes to apply")).toBeInTheDocument();
    expect(
      screen.getByText(
        "None of the selected packages will be uninstalled on the selected instances.",
      ),
    ).toBeInTheDocument();

    const [item] = screen.getAllByRole("listitem");
    assert(item);
    expect(within(item).getByText("qa-repro-excluded")).toBeInTheDocument();
    expect(
      within(item).getByText(/Will not be uninstalled on/),
    ).toBeInTheDocument();
    expect(
      within(item).getByRole("button", { name: "2 instances" }),
    ).toBeInTheDocument();

    const submitButton = screen.getByRole("button", {
      name: "Uninstall 0 packages",
    });
    expect(submitButton).toHaveAttribute("aria-disabled", "true");

    await userEvent.click(submitButton);
    expect(executeRequests).toHaveLength(0);
  });

  it("lists actionable and fully excluded packages together and only counts actionable ones", async () => {
    const executeRequests = mockExecute();
    mockSummary({
      actions: [
        {
          action: {
            type: "remove",
            package: { id: 1, name: "qa-repro-actionable", version: "1.0" },
          },
          computer_count: 3,
        },
      ],
      exclusions: [
        { package_name: "qa-repro-actionable", computer_count: 1 },
        { package_name: "qa-repro-excluded", computer_count: 2 },
      ],
    });

    renderRemoveSummary();

    const items = await screen.findAllByRole("listitem");
    expect(items).toHaveLength(2);
    const [actionableItem, excludedItem] = items;
    assert(actionableItem);
    assert(excludedItem);

    expect(
      within(actionableItem).getByText("qa-repro-actionable"),
    ).toBeInTheDocument();
    expect(
      within(actionableItem).getByRole("button", { name: "3 instances" }),
    ).toBeInTheDocument();
    expect(
      within(actionableItem).getByText(/Will not be uninstalled on/),
    ).toBeInTheDocument();
    expect(
      within(actionableItem).getByRole("button", { name: "1 instance" }),
    ).toBeInTheDocument();

    expect(
      within(excludedItem).getByText("qa-repro-excluded"),
    ).toBeInTheDocument();
    expect(
      within(excludedItem).getByText(/Will not be uninstalled on/),
    ).toBeInTheDocument();
    expect(
      within(excludedItem).getByRole("button", { name: "2 instances" }),
    ).toBeInTheDocument();

    expect(screen.queryByText("No changes to apply")).not.toBeInTheDocument();

    const submitButton = screen.getByRole("button", {
      name: "Uninstall 1 package",
    });
    expect(submitButton).not.toHaveAttribute("aria-disabled");

    await userEvent.click(submitButton);

    await waitFor(() => {
      expect(executeRequests).toHaveLength(1);
    });
    expect(
      await screen.findByText(
        "You queued qa-repro-actionable to be uninstalled.",
      ),
    ).toBeInTheDocument();
  });

  it("keeps the partial-exclusion link for an actionable package", async () => {
    mockSummary({
      actions: [
        {
          action: {
            type: "remove",
            package: { id: 1, name: "qa-repro-actionable", version: "1.0" },
          },
          computer_count: 3,
        },
      ],
      exclusions: [{ package_name: "qa-repro-actionable", computer_count: 1 }],
    });

    renderRemoveSummary();

    const [item] = await screen.findAllByRole("listitem");
    assert(item);
    expect(screen.getAllByRole("listitem")).toHaveLength(1);
    expect(
      within(item).getByText(/Will not be uninstalled on/),
    ).toBeInTheDocument();

    await userEvent.click(
      within(item).getByRole("button", { name: "1 instance" }),
    );

    expect(
      await screen.findByText("Instances not uninstalling qa-repro-actionable"),
    ).toBeInTheDocument();
  });

  it("renders an exclusion-only package whose name is an Object prototype key", async () => {
    mockSummary({
      actions: [],
      exclusions: [{ package_name: "constructor", computer_count: 2 }],
    });

    renderRemoveSummary();

    const [item] = await screen.findAllByRole("listitem");
    assert(item);
    expect(within(item).getByText("constructor")).toBeInTheDocument();
    expect(
      within(item).getByText(/Will not be uninstalled on/),
    ).toBeInTheDocument();
    expect(
      within(item).getByRole("button", { name: "2 instances" }),
    ).toBeInTheDocument();

    expect(
      screen.getByRole("button", { name: "Uninstall 0 packages" }),
    ).toHaveAttribute("aria-disabled", "true");
    expect(screen.getByRole("button", { name: "Back" })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Cancel" })).toBeInTheDocument();
  });

  it("groups actionable packages whose names are Object prototype keys", async () => {
    mockSummary({
      actions: [
        {
          action: {
            type: "remove",
            package: { id: 1, name: "constructor", version: "1.0" },
          },
          computer_count: 3,
        },
      ],
      exclusions: [{ package_name: "toString", computer_count: 2 }],
    });

    renderRemoveSummary();

    const items = await screen.findAllByRole("listitem");
    expect(items).toHaveLength(2);
    const [actionableItem, excludedItem] = items;
    assert(actionableItem);
    assert(excludedItem);

    expect(within(actionableItem).getByText("constructor")).toBeInTheDocument();
    expect(
      within(actionableItem).getByRole("button", { name: "3 instances" }),
    ).toBeInTheDocument();
    expect(within(excludedItem).getByText("toString")).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: "Uninstall 1 package" }),
    ).not.toHaveAttribute("aria-disabled");
  });

  it("uses the actionable package count in the success notification", async () => {
    mockExecute();
    server.use(
      http.get(`${API_URL}package-change-plans/:id/summary`, () =>
        HttpResponse.json<
          GetPackageChangePlanSummaryResponse<"change_version">
        >({
          actions: [
            {
              action: {
                type: "change_version",
                from_package: { id: 1, name: "qa-repro-pkg", version: "1.0" },
                to_package: { id: 3, name: "qa-repro-pkg", version: "3.0" },
              },
              computer_count: 1,
            },
            {
              action: {
                type: "change_version",
                from_package: { id: 2, name: "qa-repro-pkg", version: "2.0" },
                to_package: { id: 3, name: "qa-repro-pkg", version: "3.0" },
              },
              computer_count: 1,
            },
          ],
          exclusions: [],
        }),
      ),
    );

    renderWithProviders(
      <PackagesActionSummary
        actionType="change_version"
        onBackButtonPress={() => undefined}
        packageChangePlanId={5}
      />,
    );

    await userEvent.click(
      await screen.findByRole("button", {
        name: "Change version on 1 package",
      }),
    );

    expect(
      await screen.findByText(
        "qa-repro-pkg will be changed to a different version and is queued in Activities.",
      ),
    ).toBeInTheDocument();
  });
});
