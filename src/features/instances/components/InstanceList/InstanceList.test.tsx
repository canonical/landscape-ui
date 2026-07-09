import { NO_DATA_TEXT } from "@/components/layout/NoData/constants";
import { DEFAULT_PAGE_SIZE } from "@/libs/pageParamsManager";
import {
  instances,
  ubuntuCoreInstance,
  ubuntuInstance,
} from "@/tests/mocks/instance";
import { renderWithProviders } from "@/tests/render";
import type { Instance } from "@/types/Instance";
import { fireEvent, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import type { ComponentProps, FC } from "react";
import { useLocation } from "react-router";
import { describe, expect, vi } from "vitest";
import InstanceList from "./InstanceList";

const LocationProbe: FC = () => {
  const location = useLocation();

  return <div data-testid="location-probe">{location.search}</div>;
};

const props: ComponentProps<typeof InstanceList> = {
  instances: instances.slice(0, DEFAULT_PAGE_SIZE),
  selectedInstances: [],
  setColumnFilterOptions: vi.fn(),
  setSelectedInstances: vi.fn(),
  instanceCount: instances.length,
  isAllSelected: false,
  onSelectAll: vi.fn(),
  onClearSelection: vi.fn(),
};

describe("InstanceList", () => {
  it("should show correct distribution info for instances", async () => {
    renderWithProviders(<InstanceList {...props} />);
    // There must be at least one fresh instance
    assert(
      instances.find((instance) => {
        return instance.distribution_info === null;
      }),
    );

    for (const [i, row] of screen
      .getAllByRole<HTMLTableRowElement>("row")
      .slice(1)
      .entries()) {
      const [titleCell] = row.cells;
      assert(titleCell);

      const instance = instances[i];

      assert(instance);
      assert(row.cells[3]);

      expect(
        within(row.cells[3]).getByText(
          instance.distribution_info?.description ?? NO_DATA_TEXT,
        ),
      ).toBeInTheDocument();
    }
  });

  it("should show correct status for an archived instance", async () => {
    renderWithProviders(<InstanceList {...props} />);
    // There must be at least one archived instance
    assert(
      instances.find((instance) => {
        return instance.archived;
      }),
    );

    for (const row of screen
      .getAllByRole<HTMLTableRowElement>("row")
      .slice(1)) {
      const [firstCell] = row.cells;
      assert(firstCell);

      const instance = instances.find((rowInstance) => {
        return firstCell.textContent?.includes(rowInstance.title);
      });

      assert(instance);

      if (instance.archived) {
        const statusCell = [...row.cells].find(
          (cell) => cell.getAttribute("aria-label") === "Status",
        );
        assert(statusCell);
        expect(within(statusCell).getByText("Archived")).toBeInTheDocument();
      }
    }
  });

  it("should select all instances when clicking ToggleAll checkbox", async () => {
    const { rerender } = renderWithProviders(<InstanceList {...props} />);

    const toggleAllCheckbox = await screen.findByRole("checkbox", {
      name: /toggle all/i,
    });
    await userEvent.click(toggleAllCheckbox);

    expect(props.setSelectedInstances).toHaveBeenCalledWith(props.instances);

    rerender(<InstanceList {...props} selectedInstances={instances} />);
    const checkedCheckboxes = screen.getAllByRole("checkbox", {
      checked: true,
    });
    expect(checkedCheckboxes).toHaveLength(props.instances.length + 1);
  });

  it("should deselect all instances when clicking ToggleAll checkbox with an instance selected", async () => {
    const { rerender } = renderWithProviders(
      <InstanceList {...props} selectedInstances={[instances[0]]} />,
    );

    const toggleAllCheckbox = await screen.findByRole("checkbox", {
      name: /toggle all/i,
    });
    await userEvent.click(toggleAllCheckbox);

    expect(props.onClearSelection).toHaveBeenCalled();

    rerender(<InstanceList {...props} selectedInstances={[]} />);
    const checkedCheckboxes = screen.queryAllByRole("checkbox", {
      checked: true,
    });
    expect(checkedCheckboxes).toHaveLength(0);
  });

  it("should not show upgrades for an ubuntu core instance", async () => {
    renderWithProviders(
      <InstanceList {...props} instances={[ubuntuCoreInstance]} />,
    );

    expect(screen.queryByText("Up to date")).not.toBeInTheDocument();
  });

  it("selects an instance", async () => {
    renderWithProviders(<InstanceList {...props} />);

    const instanceCheckbox = await screen.findByRole("checkbox", {
      name: instances[0].title,
    });

    await userEvent.click(instanceCheckbox);
    expect(props.setSelectedInstances).toHaveBeenCalledWith([instances[0]]);
  });

  it("deselects an instance", async () => {
    renderWithProviders(
      <InstanceList {...props} selectedInstances={[instances[0]]} />,
    );

    const instanceCheckbox = screen.getByRole("checkbox", {
      name: instances[0].title,
    });

    expect(instanceCheckbox).toBeChecked();
    await userEvent.click(instanceCheckbox);
    expect(props.setSelectedInstances).toHaveBeenCalledWith([]);
  });

  it("toggles the tags URL filter when a tag pill is clicked", async () => {
    const taggedInstance = {
      ...ubuntuInstance,
      archived: false,
      tags: ["bionic", "server"],
    } as Instance;

    renderWithProviders(
      <>
        <InstanceList {...props} instances={[taggedInstance]} />
        <LocationProbe />
      </>,
    );

    const probe = screen.getByTestId("location-probe");
    const tagPill = screen.getByRole("button", { name: "bionic" });

    await userEvent.click(tagPill);
    expect(probe).toHaveTextContent("tags=bionic");

    await userEvent.click(screen.getByRole("button", { name: "bionic" }));
    expect(probe).not.toHaveTextContent("bionic");
  });

  it("toggles the status URL filter when a status pill is clicked", async () => {
    const offlineInstance = {
      ...ubuntuInstance,
      archived: false,
      alerts: [
        {
          type: "ComputerOfflineAlert",
          summary: "Offline",
          severity: "danger",
        },
      ],
    } as Instance;

    renderWithProviders(
      <>
        <InstanceList {...props} instances={[offlineInstance]} />
        <LocationProbe />
      </>,
    );

    const probe = screen.getByTestId("location-probe");
    const statusPill = screen.getByRole("button", { name: "Offline" });

    await userEvent.click(statusPill);
    expect(probe).toHaveTextContent("status=computer-offline");

    await userEvent.click(screen.getByRole("button", { name: "Offline" }));
    expect(probe).not.toHaveTextContent("computer-offline");
  });

  it("toggles the upgrades URL filter when an upgrade pill is clicked", async () => {
    const upgradableInstance = {
      ...ubuntuInstance,
      archived: false,
      alerts: [
        {
          type: "SecurityUpgradesAlert",
          summary: "Security",
          severity: "danger",
        },
      ],
      upgrades: { regular: 0, security: 5 },
    } as Instance;

    renderWithProviders(
      <>
        <InstanceList {...props} instances={[upgradableInstance]} />
        <LocationProbe />
      </>,
    );

    const probe = screen.getByTestId("location-probe");
    const upgradePill = screen.getByRole("button", {
      name: /security upgrade/i,
    });

    await userEvent.click(upgradePill);
    expect(probe).toHaveTextContent("upgrades=security-upgrades");

    await userEvent.click(
      screen.getByRole("button", { name: /security upgrade/i }),
    );
    expect(probe).not.toHaveTextContent("security-upgrades");
  });

  it("collapses an expanded tag cell when clicking elsewhere in the same row", async () => {
    const taggedInstance = {
      ...ubuntuInstance,
      id: 1,
      title: "tagged-instance",
      archived: false,
      tags: ["core", "jammy", "extra"],
    } as Instance;

    renderWithProviders(
      <InstanceList {...props} instances={[taggedInstance]} />,
    );

    const tagsExpander = screen
      .getAllByRole("button", { name: /show .* more/i })
      .find(
        (button) => button.closest("td")?.getAttribute("aria-label") === "Tags",
      );
    assert(tagsExpander);

    await userEvent.click(tagsExpander);
    expect(screen.getByText("jammy")).toBeVisible();

    // The title link sits in another cell of the same row; clicking it should
    // collapse the tag pop-over even though it shares the row.
    fireEvent.mouseDown(screen.getByRole("link", { name: "tagged-instance" }));
    expect(screen.queryByText("jammy")).not.toBeInTheDocument();
  });

  it("collapses an expanded tag cell when a tag pill inside it is clicked", async () => {
    const taggedInstance = {
      ...ubuntuInstance,
      id: 1,
      title: "tagged-instance",
      archived: false,
      tags: ["core", "jammy", "extra"],
    } as Instance;

    renderWithProviders(
      <>
        <InstanceList {...props} instances={[taggedInstance]} />
        <LocationProbe />
      </>,
    );

    const tagsExpander = screen
      .getAllByRole("button", { name: /show .* more/i })
      .find(
        (button) => button.closest("td")?.getAttribute("aria-label") === "Tags",
      );
    assert(tagsExpander);

    await userEvent.click(tagsExpander);
    expect(screen.getByText("jammy")).toBeVisible();

    // Clicking a tag pill inside the pop-over filters AND collapses the cell, so
    // the now-stale expansion can't carry over to whatever the filter returns.
    await userEvent.click(screen.getByRole("button", { name: "jammy" }));

    expect(screen.getByTestId("location-probe")).toHaveTextContent(
      "tags=jammy",
    );
    expect(screen.queryByText("jammy")).not.toBeInTheDocument();
  });

  it("clears selection", async () => {
    assert(props.instanceCount);
    assert(props.instanceCount > props.instances.length);

    renderWithProviders(
      <InstanceList {...props} selectedInstances={instances} />,
    );

    const clearSelectionButton = await screen.findByRole("button", {
      name: /clear selection/i,
    });

    await userEvent.click(clearSelectionButton);
    expect(props.setSelectedInstances).toHaveBeenCalledWith([]);
  });
});
