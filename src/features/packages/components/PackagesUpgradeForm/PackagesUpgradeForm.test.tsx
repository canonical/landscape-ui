import { renderWithProviders } from "@/tests/render";
import type {
  CreatePackageChangePlanRequest,
  PackageChangePlan,
  SearchUpgradesRequest,
} from "@/features/packages";
import { DEB_MANAGEMENT_PACKAGE_LIMIT } from "@/features/packages";
import { API_URL } from "@/constants";
import { DEFAULT_PAGE_SIZE } from "@/libs/pageParamsManager/constants";
import { instances, ubuntuInstance } from "@/tests/mocks/instance";
import { packages } from "@/tests/mocks/packages";
import { mockDeletePackageChangePlan } from "@/tests/mockDeletePackageChangePlan";
import {
  OPEN_SIDE_PANEL_LABEL,
  OpenInSidePanel,
} from "@/tests/OpenInSidePanel";
import server from "@/tests/server";
import { generatePaginatedResponse } from "@/tests/server/handlers/_helpers";
import { screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { http, HttpResponse } from "msw";
import type { ComponentProps } from "react";
import { afterEach, describe, expect, it, vi } from "vitest";
import PackagesUpgradeForm from "./PackagesUpgradeForm";
import PackagesUpgradeList from "../PackagesUpgradeList";
import classes from "@/context/SidePanelProvider.module.scss";

vi.mock("../PackagesUpgradeList", async (importOriginal) => {
  const { default: ActualList } = await importOriginal<{
    default: typeof PackagesUpgradeList;
  }>();

  return { default: vi.fn(ActualList) };
});

const renderInSidePanel = (
  selectedInstances: ComponentProps<
    typeof PackagesUpgradeForm
  >["selectedInstances"],
) =>
  renderWithProviders(
    <OpenInSidePanel title="Apply upgrades" size="large">
      <PackagesUpgradeForm selectedInstances={selectedInstances} />
    </OpenInSidePanel>,
  );

describe("Upgrades", () => {
  afterEach(() => {
    vi.mocked(PackagesUpgradeList).mockReset();
  });

  it("shows the package limit modal when more than the allowed upgrades are selected", async () => {
    const user = userEvent.setup();
    vi.mocked(PackagesUpgradeList).mockImplementation(
      ({ setSelectedUpgrades }) => (
        <button
          onClick={() => {
            setSelectedUpgrades(
              Array.from(
                { length: DEB_MANAGEMENT_PACKAGE_LIMIT + 1 },
                (_, id) => ({
                  id,
                  name: `package-${id}`,
                  summary: "",
                  version: "1",
                  computers: { count: 1 },
                }),
              ),
            );
          }}
        >
          Select over-limit upgrades
        </button>
      ),
    );

    renderWithProviders(
      <PackagesUpgradeForm selectedInstances={[ubuntuInstance]} />,
    );

    await user.click(
      await screen.findByRole("button", { name: "Select over-limit upgrades" }),
    );
    await user.click(screen.getByRole("button", { name: "Next" }));

    const dialog = screen.getByRole("dialog", {
      name: "Upgrade limit exceeded",
    });
    expect(dialog).toHaveTextContent(
      `Upgrades are only available for a selection of ${DEB_MANAGEMENT_PACKAGE_LIMIT} packages or fewer.`,
    );

    await user.click(screen.getByRole("button", { name: "OK" }));

    expect(
      screen.queryByRole("dialog", { name: "Upgrade limit exceeded" }),
    ).not.toBeInTheDocument();
  });

  it("resets the selection and page on search and restores unfiltered results on clear", async () => {
    const user = userEvent.setup();
    const upgrades = Array.from(
      { length: DEFAULT_PAGE_SIZE + 1 },
      (_, index) => ({
        ...packages[0],
        id: index + 1,
        name: `upgrade-${index}`,
      }),
    );
    server.use(
      http.post<never, SearchUpgradesRequest>(
        `${API_URL}packages\\:search-upgrades`,
        async ({ request }) => {
          const body = await request.json();
          const response = generatePaginatedResponse({
            data: upgrades,
            limit: body.limit,
            offset: body.offset,
            search: body.text,
            searchFields: ["name"],
          });
          return HttpResponse.json({
            packages: response.results,
            count: response.count,
            next: response.next,
            prev: response.previous,
          });
        },
      ),
    );

    renderWithProviders(
      <PackagesUpgradeForm selectedInstances={[ubuntuInstance]} />,
    );
    await user.click(await screen.findByRole("button", { name: "Next page" }));
    await user.click(
      await screen.findByRole("checkbox", {
        name: `Select upgrade-${DEFAULT_PAGE_SIZE}`,
      }),
    );
    expect(screen.getByRole("button", { name: "Next" })).not.toHaveAttribute(
      "aria-disabled",
    );

    await user.type(screen.getByRole("searchbox"), "upgrade-0{Enter}");

    expect(
      await screen.findByRole("checkbox", { name: "Select upgrade-0" }),
    ).not.toBeChecked();
    expect(screen.getByRole("button", { name: "Next" })).toHaveAttribute(
      "aria-disabled",
      "true",
    );
    await user.click(
      screen.getByRole("checkbox", { name: "Select upgrade-0" }),
    );

    await user.click(
      screen.getByRole("button", { name: "Clear search field" }),
    );

    expect(await screen.findByRole("searchbox")).toHaveValue("");
    expect(screen.getByRole("spinbutton", { name: "page number" })).toHaveValue(
      1,
    );
    expect(
      screen.getByRole("checkbox", { name: "Select upgrade-0" }),
    ).not.toBeChecked();
    expect(screen.getByRole("button", { name: "Next" })).toHaveAttribute(
      "aria-disabled",
      "true",
    );
  });

  it("creates a plan for the selected upgrades and deletes it when Summary is closed", async () => {
    const user = userEvent.setup();
    const deletedIds = mockDeletePackageChangePlan();
    const createRequests: CreatePackageChangePlanRequest[] = [];
    server.use(
      http.post<never, CreatePackageChangePlanRequest>(
        `${API_URL}package-change-plans`,
        async ({ request }) => {
          createRequests.push(await request.json());
          return HttpResponse.json<PackageChangePlan>({
            id: 6,
            state: "pending",
            action: "upgrade",
            created_at: new Date().toISOString(),
            item_count: 1,
            activity_id: null,
            executed_at: null,
            expires_at: null,
          });
        },
      ),
    );
    renderInSidePanel([ubuntuInstance]);
    await user.click(
      screen.getByRole("button", { name: OPEN_SIDE_PANEL_LABEL }),
    );
    await user.click(
      await screen.findByRole("checkbox", {
        name: `Select ${packages[0].name}`,
      }),
    );
    await user.click(screen.getByRole("button", { name: "Next" }));

    expect(
      await screen.findByRole("heading", { name: "Summary" }),
    ).toBeInTheDocument();
    expect(createRequests).toEqual([
      {
        computer_query: `id:${ubuntuInstance.id}`,
        upgrade_config: { select_by_ids: { package_ids: [packages[0].id] } },
      },
    ]);
    expect(
      screen.getByRole("heading", { name: "Summary" }).closest("aside"),
    ).toHaveClass(classes.medium);
    await screen.findByRole("button", { name: "Back" });

    await user.click(screen.getByRole("button", { name: "Close side panel" }));

    await waitFor(() => {
      expect(deletedIds).toEqual(["6"]);
    });
    expect(
      screen.queryByRole("heading", { name: "Summary" }),
    ).not.toBeInTheDocument();
  });

  it.each([
    {
      selectedInstances: [ubuntuInstance],
      title: `Apply upgrades to ${ubuntuInstance.title}`,
    },
    {
      selectedInstances: instances.slice(0, 2),
      title: "Apply upgrades to 2 instances",
    },
  ])(
    "restores '$title' and clears the close override on Back",
    async ({ selectedInstances, title }) => {
      const user = userEvent.setup();
      const deletedIds = mockDeletePackageChangePlan();
      renderInSidePanel(selectedInstances);
      await user.click(
        screen.getByRole("button", { name: OPEN_SIDE_PANEL_LABEL }),
      );
      await user.click(
        await screen.findByRole("checkbox", {
          name: `Select ${packages[0].name}`,
        }),
      );
      await user.click(screen.getByRole("button", { name: "Next" }));
      await user.click(await screen.findByRole("button", { name: "Back" }));

      const heading = screen.getByRole("heading", { name: title });
      expect(heading).toBeInTheDocument();
      expect(heading.closest("aside")).not.toHaveClass(classes.medium);
      expect(heading.closest("aside")).toHaveClass("is-wide");
      expect(
        screen.getByRole("checkbox", { name: `Select ${packages[0].name}` }),
      ).toBeChecked();
      await waitFor(() => {
        expect(deletedIds).toEqual(["6"]);
      });

      await user.click(
        screen.getByRole("button", { name: "Close side panel" }),
      );

      expect(
        screen.queryByRole("heading", { name: title }),
      ).not.toBeInTheDocument();
      expect(deletedIds).toEqual(["6"]);
    },
  );
});
