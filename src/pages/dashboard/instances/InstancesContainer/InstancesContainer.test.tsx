import { renderWithProviders } from "@/tests/render";
import InstancesContainer from "./InstancesContainer";
import userEvent from "@testing-library/user-event";
import { screen } from "@testing-library/react";
import { expectLoadingState } from "@/tests/helpers";

const columns = [
  {
    label: "Name",
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
  it("should ", async () => {
    const { container } = renderWithProviders(
      <InstancesContainer
        selectedInstances={[]}
        setSelectedInstances={() => undefined}
      />,
    );

    await expectLoadingState();

    expect(container).toHaveTexts([
      "Group by",
      "Access group",
      "Tag",
      "Columns",
      ...columns.map(({ label }) => label),
    ]);

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
});
