import { instances } from "@/tests/mocks/instance";
import { renderWithProviders } from "@/tests/render";
import { screen, within } from "@testing-library/react";
import { describe, expect, vi } from "vitest";
import InstanceList from "./InstanceList";
import { NO_DATA_TEXT } from "@/components/layout/NoData/constants";
import userEvent from "@testing-library/user-event";

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
});
