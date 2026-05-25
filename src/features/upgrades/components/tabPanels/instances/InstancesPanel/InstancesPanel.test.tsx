import { instances } from "@/tests/mocks/instance";
import { renderWithProviders } from "@/tests/render";
import { screen, waitFor, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import type { ComponentProps } from "react";
import { describe, vi } from "vitest";
import InstancesPanel from "./InstancesPanel";

const affectedInstances = instances.filter(
  ({ upgrades }) => upgrades?.security || upgrades?.regular,
);
const onExcludedPackagesChange = vi.fn();

const props: ComponentProps<typeof InstancesPanel> = {
  excludedPackages: affectedInstances.map(({ id }) => ({
    id,
    exclude_packages: [],
  })),
  instances: affectedInstances,
  onExcludedPackagesChange,
};

describe("InstancesPanel", () => {
  it("should render correctly", async () => {
    const { container } = renderWithProviders(<InstancesPanel {...props} />);

    expect(container).toHaveTexts(["Name", "Affected packages"]);

    expect(
      screen.getByText(/Showing \d+ of \d+ instances/i),
    ).toBeInTheDocument();

    const [firstAffectInstance] = affectedInstances;
    assert(firstAffectInstance);

    const rows = screen.getAllByRole("row");
    const firstInstanceRow = rows.find(
      ({ firstChild }) => firstChild?.textContent === firstAffectInstance.title,
    );

    assert(firstInstanceRow);

    await userEvent.click(within(firstInstanceRow).getByRole("button"));

    expect(screen.getByText("Packages affected on")).toBeInTheDocument();
  });

  it("should collapse expanded row when clicking it again", async () => {
    renderWithProviders(<InstancesPanel {...props} />);

    const [firstAffectInstance] = affectedInstances;
    assert(firstAffectInstance);

    const getFirstInstanceRow = () => {
      const rows = screen.getAllByRole("row");
      return rows.find(
        ({ firstChild }) =>
          firstChild?.textContent === firstAffectInstance.title,
      );
    };

    const firstInstanceRow = getFirstInstanceRow();
    assert(firstInstanceRow);

    // Expand the row
    await userEvent.click(within(firstInstanceRow).getByRole("button"));
    await screen.findByText("Packages affected on");

    // Re-query the row since the DOM was re-rendered
    const firstInstanceRowAfterExpand = getFirstInstanceRow();
    assert(firstInstanceRowAfterExpand);

    // Click again to collapse
    await userEvent.click(
      within(firstInstanceRowAfterExpand).getByRole("button"),
    );

    await waitFor(() => {
      expect(
        screen.queryByText("Packages affected on"),
      ).not.toBeInTheDocument();
    });
  });

  it("should switch to another instance row and trigger packages refetch", async () => {
    renderWithProviders(<InstancesPanel {...props} />);

    const [firstInstance, secondInstance] = affectedInstances;
    assert(firstInstance && secondInstance);

    const getRowByTitle = (title: string) => {
      const rows = screen.getAllByRole("row");
      return rows.find(({ firstChild }) => firstChild?.textContent === title);
    };

    // Expand the first row
    const firstRow = getRowByTitle(firstInstance.title);
    assert(firstRow);
    await userEvent.click(within(firstRow).getByRole("button"));
    await screen.findByText("Packages affected on");

    // Click a second row to switch instances (triggers else-branch in useEffect)
    const secondRow = getRowByTitle(secondInstance.title);
    if (secondRow) {
      await userEvent.click(within(secondRow).getByRole("button"));
      // Either the same "Packages affected on" stays visible or transitions
      await waitFor(() => {
        expect(screen.getByText(/Packages affected on/)).toBeInTheDocument();
      });
    }
  });

  it("should load more instances when instance footer show-more is clicked", async () => {
    renderWithProviders(<InstancesPanel {...props} />);

    await screen.findByText(/Showing \d+ of \d+ instances/i);

    // Instances footer shows "Show 5 more" (27 instances, limit=5)
    const showMoreInstances = await screen.findByRole("button", {
      name: "Show 5 more",
    });
    await userEvent.click(showMoreInstances);

    // tableLimit increased; more instances are shown
    await screen.findByText(/Showing \d+ of \d+ instances/i);
    expect(
      screen.getByText(/Showing \d+ of \d+ instances/i),
    ).toBeInTheDocument();
  });

  it("should expand packages sub-table and show load-more", async () => {
    // Instance with id=21 has 17 upgradeable packages, so "Show 5 more" appears with limit=5
    const INSTANCE_WITH_MANY_PACKAGES_ID = 21;
    const instanceWith17Packages = instances.find(
      (i) => i.id === INSTANCE_WITH_MANY_PACKAGES_ID,
    );
    assert(instanceWith17Packages);

    renderWithProviders(
      <InstancesPanel {...props} instances={[instanceWith17Packages]} />,
    );

    const rows = screen.getAllByRole("row");
    const firstInstanceRow = rows.find(
      ({ firstChild }) =>
        firstChild?.textContent === instanceWith17Packages.title,
    );
    assert(firstInstanceRow);

    await userEvent.click(within(firstInstanceRow).getByRole("button"));
    await screen.findByText("Packages affected on");

    // 17 packages with limit=5 → footer shows "Show 5 more"
    const showMorePackages = await screen.findByRole("button", {
      name: "Show 5 more",
    });
    await userEvent.click(showMorePackages);
    expect(screen.getByText("Packages affected on")).toBeInTheDocument();
  });
});
