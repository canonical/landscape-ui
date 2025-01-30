import type { ComponentProps } from "react";
import { describe, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import type { InstancePackagesToExclude } from "@/features/packages";
import { instances } from "@/tests/mocks/instance";
import { getInstancePackages } from "@/tests/mocks/packages";
import AffectedPackages from "./AffectedPackages";

const increasedLimit = 10;
const instance = instances[instances.length - 1];
const limit = 5;
const excludedPackages: InstancePackagesToExclude[] = [
  { id: instance.id, exclude_packages: [] },
];
const onExcludedPackagesChange = vi.fn();
const onLimitChange = vi.fn();
const packages = getInstancePackages(instance.id);
const newExcludedPackages = excludedPackages.map((instanceExcludedPackages) =>
  instance.id === instanceExcludedPackages.id
    ? {
        id: instanceExcludedPackages.id,
        exclude_packages: [packages[increasedLimit - 1].id],
      }
    : instanceExcludedPackages,
);

const getPackageCheckboxes = () => {
  return screen.getAllByRole("checkbox", {
    name: /^Toggle\s+[a-zA-Z0-9-' ]+\s+package$/,
  });
};

const props: ComponentProps<typeof AffectedPackages> = {
  excludedPackages,
  instance,
  onExcludedPackagesChange,
  onLimitChange,
  packages: packages.slice(0, limit),
  packagesCount: packages.length,
  packagesLoading: false,
};

describe("AffectedPackages", () => {
  it("should render component with initial state correctly", async () => {
    const { container } = render(<AffectedPackages {...props} />);

    expect(container).toHaveTexts([
      "Name",
      "Current version",
      "New version",
      "Details",
      `Showing ${limit} of ${packages.length} packages.`,
    ]);

    expect(screen.getByLabelText("Toggle all packages")).toBeChecked();

    const packageCheckboxes = getPackageCheckboxes();

    expect(packageCheckboxes).toHaveLength(limit);

    packageCheckboxes.forEach((checkbox) => {
      expect(checkbox).toBeChecked();
    });

    await userEvent.click(screen.getByText("Show 5 more"));

    expect(onLimitChange).toHaveBeenCalledTimes(1);
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

    await userEvent.click(
      screen.getByLabelText(
        `Toggle ${packages[increasedLimit - 1].name} package`,
      ),
    );

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
    ).toBeTruthy();
    expect(
      screen.getByLabelText(
        `Toggle ${packages[increasedLimit - 1].name} package`,
      ),
    ).not.toBeChecked();
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
});
