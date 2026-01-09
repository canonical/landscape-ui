import { instances } from "@/tests/mocks/instance";
import { packages } from "@/tests/mocks/packages";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import type { ComponentProps } from "react";
import { describe, vi } from "vitest";
import AffectedInstances from "./AffectedInstances";

const [currentPackage] = packages;
const excludedPackages = instances.map(({ id }) => ({
  id,
  exclude_packages: [],
}));
const increasedLimit = 10;
const limit = 5;
const increasedInstanceCount = Math.min(
  increasedLimit,
  currentPackage.computers.length,
);
const lastInstance = instances.filter((instance) =>
  currentPackage.computers.some(({ id }) => id === instance.id),
)[increasedInstanceCount - 1];
assert(lastInstance);
const newExcludedPackages = excludedPackages.map((instanceExcludedPackages) =>
  lastInstance.id === instanceExcludedPackages.id
    ? {
        id: instanceExcludedPackages.id,
        exclude_packages: [currentPackage.id],
      }
    : instanceExcludedPackages,
);
const onExcludedPackagesChange = vi.fn();
const onLimitChange = vi.fn();

const getPackageCheckboxes = () => {
  return screen.getAllByRole("checkbox", {
    name: /^Toggle\s+[a-zA-Z0-9-' ]+\s+instance$/,
  });
};

const props: ComponentProps<typeof AffectedInstances> = {
  currentPackage,
  excludedPackages,
  limit,
  onExcludedPackagesChange,
  onLimitChange,
  selectedInstances: instances,
};

describe("AffectedInstances", () => {
  it("should render component with initial state correctly", async () => {
    const { container } = render(<AffectedInstances {...props} />);

    expect(container).toHaveTexts([
      "Name",
      "Current version",
      "New version",
      `Showing ${limit} of ${currentPackage.computers.length} instances`,
    ]);

    expect(screen.getByLabelText("Toggle all instances")).toBeChecked();

    const packageCheckboxes = getPackageCheckboxes();

    expect(packageCheckboxes).toHaveLength(limit);

    packageCheckboxes.forEach((checkbox) => {
      expect(checkbox).toBeChecked();
    });

    await userEvent.click(
      screen.getByText(
        `Show ${Math.min(5, currentPackage.computers.length - 5)} more`,
      ),
    );

    expect(onLimitChange).toHaveBeenCalledTimes(1);
  });

  it("should invoke excluded packages state change function with appropriate parameters", async () => {
    render(<AffectedInstances {...props} limit={increasedLimit} />);

    const packageCheckboxes = getPackageCheckboxes();

    expect(packageCheckboxes).toHaveLength(increasedInstanceCount);

    packageCheckboxes.forEach((checkbox) => {
      expect(checkbox).toBeChecked();
    });

    await userEvent.click(
      screen.getByLabelText(`Toggle ${lastInstance.title} instance`),
    );

    expect(onExcludedPackagesChange).toHaveBeenCalledWith(newExcludedPackages);
  });

  it("should render appropriate checkboxes state with excluded package", () => {
    render(
      <AffectedInstances
        {...props}
        excludedPackages={newExcludedPackages}
        limit={increasedLimit}
      />,
    );

    expect(screen.getByLabelText("Toggle all instances")).not.toBeChecked();
    expect(
      screen.getByLabelText<HTMLInputElement>("Toggle all instances")
        .indeterminate,
    ).toBe(true);
    expect(
      screen.getByLabelText(`Toggle ${lastInstance.title} instance`),
    ).not.toBeChecked();
  });

  it("should render 'select all' button", async () => {
    render(
      <AffectedInstances {...props} excludedPackages={newExcludedPackages} />,
    );

    expect(screen.getByLabelText("Toggle all instances")).toBeChecked();

    const instanceIdSet = new Set(currentPackage.computers.map(({ id }) => id));

    expect(
      screen.getByText(
        `Selected ${instanceIdSet.size - 1} instances currently.`,
      ),
    ).toBeInTheDocument();

    await userEvent.click(
      screen.getByText(`Select all ${instanceIdSet.size} instances.`),
    );

    expect(onExcludedPackagesChange).toHaveBeenCalledWith(excludedPackages);
  });
});
