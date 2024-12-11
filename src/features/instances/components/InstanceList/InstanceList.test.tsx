import { instances } from "@/tests/mocks/instance";
import { renderWithProviders } from "@/tests/render";
import { screen, within } from "@testing-library/react";
import { describe, expect, vi } from "vitest";
import InstanceList from "./InstanceList";
import { NO_DATA_TEXT } from "@/components/layout/NoData/constants";

const props = {
  instances,
  selectedInstances: [],
  setColumnFilterOptions: vi.fn(),
  setSelectedInstances: vi.fn(),
};

describe("InstanceList", () => {
  beforeEach(() => {
    renderWithProviders(<InstanceList {...props} />);
  });

  it("should show correct distribution info for instances", async () => {
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
});
