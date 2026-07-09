import { resetScreenSize, setScreenSize } from "@/tests/helpers";
import { renderWithProviders } from "@/tests/render";
import { screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import type { ComponentProps } from "react";
import { afterEach, vi } from "vitest";
import InstancesContainer from "./InstancesContainer";
import { ubuntuInstance } from "@/tests/mocks/instance";

const props: Omit<
  ComponentProps<typeof InstancesContainer>,
  "setSelectedInstances"
> = {
  instances: [ubuntuInstance],
  instanceCount: 1,
  isGettingInstances: false,
  selectedInstances: [],
  onChangeFilter: vi.fn(),
  isAllSelected: false,
  onSelectAll: vi.fn(),
  onClearSelection: vi.fn(),
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

      const checkbox = screen.getByRole("checkbox", {
        name: checkboxLabel,
      });

      if (canBeHidden) {
        expect(checkbox).toBeEnabled();

        await userEvent.click(checkbox);

        selectedColumnCount -= 1;

        expect(
          screen.queryByRole("columnheader", { name: label }),
        ).not.toBeInTheDocument();
      } else {
        expect(checkbox).toBeDisabled();
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

  it("shows loading state while instances are loading", () => {
    renderWithProviders(
      <InstancesContainer
        {...props}
        instanceCount={undefined}
        isGettingInstances
        setSelectedInstances={() => undefined}
      />,
    );

    expect(screen.getByRole("status")).toBeInTheDocument();
  });

  it("shows empty state when there are no instances and not loading", () => {
    renderWithProviders(
      <InstancesContainer
        {...props}
        instanceCount={0}
        instances={[]}
        isGettingInstances={false}
        setSelectedInstances={() => undefined}
      />,
    );

    expect(screen.getByText("No instances found")).toBeInTheDocument();
  });

  it("shows table empty message for filtered empty results", () => {
    renderWithProviders(
      <InstancesContainer
        {...props}
        instanceCount={0}
        instances={[]}
        isGettingInstances={false}
        setSelectedInstances={() => undefined}
      />,
      undefined,
      "/instances?query=random-filter",
    );

    expect(
      screen.getByText(
        "No instances found according to your search parameters.",
      ),
    ).toBeInTheDocument();
    expect(screen.queryByText("No instances found")).not.toBeInTheDocument();
  });

  it("shows table empty message when only upgrades filter is active", () => {
    renderWithProviders(
      <InstancesContainer
        {...props}
        instanceCount={0}
        instances={[]}
        isGettingInstances={false}
        setSelectedInstances={() => undefined}
      />,
      undefined,
      "/instances?upgrades=security-upgrades",
    );

    expect(
      screen.getByText(
        "No instances found according to your search parameters.",
      ),
    ).toBeInTheDocument();
    expect(screen.queryByText("No instances found")).not.toBeInTheDocument();
  });

  it("shows global empty state when only groupBy is set", () => {
    renderWithProviders(
      <InstancesContainer
        {...props}
        instanceCount={0}
        instances={[]}
        isGettingInstances={false}
        setSelectedInstances={() => undefined}
      />,
      undefined,
      "/instances?groupBy=status",
    );

    expect(screen.getByText("No instances found")).toBeInTheDocument();
    expect(
      screen.queryByText(
        "No instances found according to your search parameters.",
      ),
    ).not.toBeInTheDocument();
  });
});
