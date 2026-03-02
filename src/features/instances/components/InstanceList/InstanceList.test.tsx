import { NO_DATA_TEXT } from "@/components/layout/NoData/constants";
import { DEFAULT_PAGE_SIZE } from "@/libs/pageParamsManager";
import { instances, ubuntuCoreInstance } from "@/tests/mocks/instance";
import { renderWithProviders } from "@/tests/render";
import { screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import type { ComponentProps } from "react";
import { describe, expect, vi } from "vitest";
import InstanceList from "./InstanceList";

const props: ComponentProps<typeof InstanceList> = {
  instances: instances.slice(0, DEFAULT_PAGE_SIZE),
  selectedInstances: [],
  setColumnFilterOptions: vi.fn(),
  setSelectedInstances: vi.fn(),
  instanceCount: instances.length,
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
        assert(row.cells[1]);
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

  it("should deselect all instances when clicking ToggleAll checkbox with an instance selected", async () => {
    const { rerender } = renderWithProviders(
      <InstanceList {...props} selectedInstances={[instances[0]]} />,
    );

    const toggleAllCheckbox = await screen.findByRole("checkbox", {
      name: /toggle all/i,
    });
    await userEvent.click(toggleAllCheckbox);

    expect(props.setSelectedInstances).toHaveBeenCalledWith([]);

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
