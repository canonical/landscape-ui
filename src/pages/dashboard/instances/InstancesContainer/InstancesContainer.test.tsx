import { resetScreenSize, setScreenSize } from "@/tests/helpers";
import { renderWithProviders } from "@/tests/render";
import { screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import type { ComponentProps } from "react";
import { afterEach } from "vitest";
import InstancesContainer from "./InstancesContainer";
import { ubuntuInstance } from "@/tests/mocks/instance";

const props: Omit<
  ComponentProps<typeof InstancesContainer>,
  "setSelectedInstances"
> = {
  instances: [],
  instanceCount: 0,
  isGettingInstances: false,
  selectedInstances: [],
  onChangeFilter: vi.fn(),
};

const columns = [
  {
    label: "Title",
    checkboxLabel: "Instance name",
    canBeHidden: false,
  },
  {
    label: "Status",
    checkboxLabel: "Status",
    canBeHidden: true,
  },
  {
    label: "Upgrades",
    checkboxLabel: "Upgrades",
    canBeHidden: true,
  },
  {
    label: "OS",
    checkboxLabel: "OS",
    canBeHidden: true,
  },
  {
    label: "Tags",
    checkboxLabel: "Tags",
    canBeHidden: true,
  },
  {
    label: "Availability zone",
    checkboxLabel: "Availability zone",
    canBeHidden: true,
  },
  {
    label: "Ubuntu pro expiration",
    checkboxLabel: "Ubuntu pro",
    canBeHidden: true,
  },
  {
    label: "Last ping time",
    checkboxLabel: "Last ping",
    canBeHidden: true,
  },
];

describe("InstancesContainer", () => {
  afterEach(() => {
    resetScreenSize();
  });

  it("should manage table columns", async () => {
    setScreenSize("xxl");

    renderWithProviders(
      <InstancesContainer {...props} setSelectedInstances={() => undefined} />,
    );

    const filtersButton = screen.getByRole("button", { name: /filters/i });
    await userEvent.click(filtersButton);

    const expectedLabels = [
      "Access groups",
      "Tags",
      "Columns",
      ...columns.map(({ label }) => label),
    ];

    await waitFor(() => {
      for (const text of expectedLabels) {
        expect(screen.getAllByText(text).length).toBeGreaterThan(0);
      }
    });
    await userEvent.click(screen.getByText("Columns"));

    expect(screen.getAllByRole("checkbox", { checked: true })).toHaveLength(
      columns.length,
    );

    let selectedColumnCount = columns.length;

    expect(
      screen.getByText(`${selectedColumnCount} of ${columns.length} selected`),
    ).toBeInTheDocument();

    for (const { canBeHidden, checkboxLabel, label } of columns) {
      expect(
        screen.getByRole("columnheader", { name: label }),
      ).toBeInTheDocument();

      if (canBeHidden) {
        expect(screen.getByLabelText(checkboxLabel)).toBeEnabled();

        await userEvent.click(screen.getByLabelText(checkboxLabel));

        selectedColumnCount -= 1;

        expect(
          screen.queryByRole("columnheader", { name: label }),
        ).not.toBeInTheDocument();
      } else {
        expect(screen.getByLabelText(checkboxLabel)).toBeDisabled();
      }

      expect(
        screen.getByText(
          `${selectedColumnCount} of ${columns.length} selected`,
        ),
      ).toBeInTheDocument();
    }

    await userEvent.click(screen.getByText("Select all"));

    expect(screen.getAllByRole("checkbox", { checked: true })).toHaveLength(
      columns.length,
    );
    expect(
      screen.getByText(`${columns.length} of ${columns.length} selected`),
    ).toBeInTheDocument();

    for (const { label } of columns) {
      expect(
        screen.getByRole("columnheader", { name: label }),
      ).toBeInTheDocument();
    }
  });

  it("should have selected instances as null initially", () => {
    const setSelectedInstances = vi.fn();
    renderWithProviders(
      <InstancesContainer
        {...props}
        setSelectedInstances={setSelectedInstances}
      />,
    );

    expect(setSelectedInstances).toHaveBeenCalledTimes(0);
  });

  it("should update selected instances when an instance is selected", async () => {
    const setSelectedInstances = vi.fn();
    const mockInstance = ubuntuInstance;

    renderWithProviders(
      <InstancesContainer
        {...props}
        setSelectedInstances={setSelectedInstances}
      />,
    );

    setSelectedInstances([mockInstance]);

    expect(setSelectedInstances).toHaveBeenCalledTimes(1);
    expect(setSelectedInstances).toHaveBeenCalledWith([mockInstance]);
  });
});
