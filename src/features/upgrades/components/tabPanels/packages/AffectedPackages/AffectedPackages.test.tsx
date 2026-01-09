import { instances } from "@/tests/mocks/instance";
import { packages } from "@/tests/mocks/packages";
import { render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import type { ComponentProps } from "react";
import { describe, vi } from "vitest";
import AffectedPackages from "./AffectedPackages";

const excludedPackages = instances.map(({ id }) => ({
  id,
  exclude_packages: [],
}));
const increasedIndex = 9;
const increasedLimit = increasedIndex + 1;
const increasedPackage = packages[increasedIndex];
const limit = 5;
const newExcludedPackages = excludedPackages.map((instanceExcludedPackages) =>
  increasedPackage.computers.some(
    ({ id }) => id === instanceExcludedPackages.id,
  )
    ? {
        id: instanceExcludedPackages.id,
        exclude_packages: [increasedPackage.id],
      }
    : instanceExcludedPackages,
);
const onExcludedPackagesChange = vi.fn();
const onTableLimitChange = vi.fn();

const getPackageCheckboxes = () => {
  return screen.getAllByRole("checkbox", {
    name: /^Toggle\s+[a-zA-Z0-9-' ]+\s+package$/,
  });
};

const props: ComponentProps<typeof AffectedPackages> = {
  excludedPackages,
  hasNoMoreItems: false,
  instances,
  isPackagesLoading: false,
  onExcludedPackagesChange,
  onTableLimitChange,
  packages: packages.slice(0, limit),
  totalPackageCount: packages.length,
};

describe("AffectedPackages", () => {
  it("should render component with initial state correctly", async () => {
    const { container } = render(<AffectedPackages {...props} />);

    expect(container).toHaveTexts([
      "Package name",
      "Affected instances",
      `Showing ${limit} of ${packages.length} packages.`,
    ]);

    expect(screen.getByLabelText("Toggle all packages")).toBeChecked();

    const packageCheckboxes = getPackageCheckboxes();

    expect(packageCheckboxes).toHaveLength(limit);

    packageCheckboxes.forEach((checkbox) => {
      expect(checkbox).toBeChecked();
    });

    await userEvent.click(screen.getByText("Show 5 more"));

    expect(onTableLimitChange).toHaveBeenCalledTimes(1);
  });

  it("should invoke excluded packages state change function with appropriate parameters", async () => {
    render(
      <AffectedPackages
        {...props}
        packages={packages.slice(0, increasedLimit)}
      />,
    );

    const packageCheckboxes = getPackageCheckboxes();

    expect(packageCheckboxes).toHaveLength(increasedLimit);

    packageCheckboxes.forEach((checkbox) => {
      expect(checkbox).toBeChecked();
    });

    expect(
      screen.getByText(
        `Showing ${increasedLimit} of ${packages.length} packages.`,
      ),
    ).toBeInTheDocument();

    const [toggleButton] = screen.getAllByLabelText(
      `Toggle ${increasedPackage.name} package`,
    );
    assert(toggleButton);
    await userEvent.click(toggleButton);

    expect(onExcludedPackagesChange).toHaveBeenCalledWith(newExcludedPackages);
  });

  it("should render appropriate checkboxes state with excluded package", () => {
    render(
      <AffectedPackages
        {...props}
        excludedPackages={newExcludedPackages}
        packages={packages.slice(0, increasedLimit)}
      />,
    );

    expect(screen.getByLabelText("Toggle all packages")).not.toBeChecked();
    expect(
      screen.getByLabelText<HTMLInputElement>("Toggle all packages")
        .indeterminate,
    ).toBe(true);

    screen
      .getAllByLabelText(`Toggle ${increasedPackage.name} package`)
      .forEach((checkbox) => {
        expect(checkbox).not.toBeChecked();
      });
  });

  it("should render 'select all' button", async () => {
    render(
      <AffectedPackages {...props} excludedPackages={newExcludedPackages} />,
    );

    expect(screen.getByLabelText("Toggle all packages")).toBeChecked();

    expect(
      screen.getByText(`Selected ${packages.length - 1} packages currently.`),
    ).toBeInTheDocument();

    await userEvent.click(
      screen.getByText(`Select all ${packages.length} packages.`),
    );

    expect(onExcludedPackagesChange).toHaveBeenCalledWith(excludedPackages);
  });

  it("should render instances affected by package on relative button click", async () => {
    render(<AffectedPackages {...props} />);

    const rows = screen.getAllByRole("row");

    const firstPackageRow = rows.find(
      ({ childNodes }) => childNodes.item(1).textContent === packages[0].name,
    );

    assert(firstPackageRow);

    await userEvent.click(within(firstPackageRow).getByRole("button"));

    expect(screen.getByText("Instances affected by")).toBeInTheDocument();
  });
});
