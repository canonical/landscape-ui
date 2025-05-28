import { NO_DATA_TEXT } from "@/components/layout/NoData/constants";
import { instances, ubuntuCoreInstance } from "@/tests/mocks/instance";
import { renderWithProviders } from "@/tests/render";
import { screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, vi } from "vitest";
import InstanceList from "./InstanceList";

const props = {
  instances,
  selectedInstances: [],
  setColumnFilterOptions: vi.fn(),
  setSelectedInstances: vi.fn(),
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

    for (const row of screen
      .getAllByRole<HTMLTableRowElement>("row")
      .slice(1)) {
      const instance = instances.find((instance) => {
        return row.cells[0].textContent?.includes(instance.title);
      });

      assert(instance);

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
      const instance = instances.find((rowInstance) => {
        return row.cells[0].textContent?.includes(rowInstance.title);
      });

      assert(instance);

      if (instance.archived) {
        expect(within(row.cells[1]).getByText("Archived")).toBeInTheDocument();
      }
    }
  });

  it("should select all instances when clicking ToggleAll checkbox", async () => {
    const { rerender } = renderWithProviders(<InstanceList {...props} />);

    const toggleAllCheckbox = await screen.findByRole("checkbox", {
      name: /toggle all/i,
    });
    await userEvent.click(toggleAllCheckbox);

    expect(props.setSelectedInstances).toHaveBeenCalledWith(instances);

    rerender(<InstanceList {...props} selectedInstances={instances} />);
    const checkedCheckboxes = screen.getAllByRole("checkbox", {
      checked: true,
    });
    expect(checkedCheckboxes).toHaveLength(instances.length + 1);
  });

  it("should show upgrades for an ubuntu core instance", async () => {
    renderWithProviders(
      <InstanceList {...props} instances={[ubuntuCoreInstance]} />,
    );

    expect(screen.getByText("Up to date")).toBeInTheDocument();
  });
});
