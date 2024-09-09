import { ComponentProps } from "react";
import { describe, vi } from "vitest";
import { screen, within } from "@testing-library/react";
import { instances } from "@/tests/mocks/instance";
import { renderWithProviders } from "@/tests/render";
import InstancesPanel from "./InstancesPanel";
import userEvent from "@testing-library/user-event";

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

    const rows = screen.getAllByRole("row");
    const firstInstanceRow = rows.find(
      ({ firstChild }) =>
        firstChild?.textContent === affectedInstances[0].title,
    );

    if (!firstInstanceRow) {
      throw new Error("Row not found");
    }

    await userEvent.click(within(firstInstanceRow).getByRole("button"));

    expect(screen.getByText("Packages affected on")).toBeInTheDocument();
  });
});
