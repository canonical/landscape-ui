import { instances } from "@/tests/mocks/instance";
import { renderWithProviders } from "@/tests/render";
import { screen, within } from "@testing-library/react";
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
});
