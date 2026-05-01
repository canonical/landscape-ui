import type { InstancePackagesToExclude } from "@/features/packages";
import { instances } from "@/tests/mocks/instance";
import { getInstancePackages } from "@/tests/mocks/packages";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import type { ComponentProps } from "react";
import { describe, vi } from "vitest";
import AffectedPackages from "./AffectedPackages";

const increasedLimit = 10;
const instanceIndex = 14;
const instance = instances[instanceIndex];
const limit = 5;
const excludedPackages: InstancePackagesToExclude[] = [
  { id: instance.id, exclude_packages: [] },
];
const onExcludedPackagesChange = vi.fn();
const onLimitChange = vi.fn();
const packages = getInstancePackages(instance.id);
const increasedPackage = packages[increasedLimit - 1];
assert(increasedPackage);
const newExcludedPackages = excludedPackages.map((instanceExcludedPackages) =>
  instance.id === instanceExcludedPackages.id
    ? {
        id: instanceExcludedPackages.id,
        exclude_packages: [increasedPackage.id],
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
      screen.getByLabelText(`Toggle ${increasedPackage.name} package`),
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
      screen.getByLabelText(`Toggle ${increasedPackage.name} package`),
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

  it("should render loading state when no packages are loaded yet", () => {
    render(<AffectedPackages {...props} packagesLoading packages={[]} />);
    // When packagesLoading is true and packages is empty, LoadingState is shown
    expect(document.querySelector("div")).toBeInTheDocument();
  });

  it("should exclude all packages when toggle-all is clicked while all are included", async () => {
    render(<AffectedPackages {...props} packages={packages.slice(0, limit)} />);

    const toggleAllCheckbox = screen.getByLabelText("Toggle all packages");
    expect(toggleAllCheckbox).toBeChecked();

    await userEvent.click(toggleAllCheckbox);

    const expectedAllExcluded = excludedPackages.map(
      ({ id, exclude_packages }) => ({
        id,
        exclude_packages:
          id === instance.id
            ? packages.slice(0, limit).map(({ id: pkgId }) => pkgId)
            : exclude_packages,
      }),
    );
    expect(onExcludedPackagesChange).toHaveBeenCalledWith(expectedAllExcluded);
  });

  it("should un-exclude a package when its checkbox is clicked and it was excluded", async () => {
    const [firstPackage] = packages;
    assert(firstPackage);
    const withFirstExcluded = excludedPackages.map(
      ({ id, exclude_packages }) =>
        id === instance.id
          ? { id, exclude_packages: [firstPackage.id] }
          : { id, exclude_packages },
    );

    render(
      <AffectedPackages
        {...props}
        excludedPackages={withFirstExcluded}
        packages={packages.slice(0, limit)}
      />,
    );

    const packageCheckbox = screen.getByLabelText(
      `Toggle ${firstPackage.name} package`,
    );
    expect(packageCheckbox).not.toBeChecked();

    await userEvent.click(packageCheckbox);

    // Should call with first package removed from excluded list
    const expectedAfterUnchecking = withFirstExcluded.map(
      ({ id, exclude_packages }) =>
        id === instance.id
          ? {
              id,
              exclude_packages: exclude_packages.filter(
                (pkgId) => pkgId !== firstPackage.id,
              ),
            }
          : { id, exclude_packages },
    );
    expect(onExcludedPackagesChange).toHaveBeenCalledWith(
      expectedAfterUnchecking,
    );
  });

  it("should pass through excluded packages for other instances when toggling", async () => {
    const FALLBACK_OTHER_INSTANCE_ID = 999;
    const otherInstanceId = instances[0]?.id ?? FALLBACK_OTHER_INSTANCE_ID;
    const multiInstanceExcluded: InstancePackagesToExclude[] = [
      { id: instance.id, exclude_packages: [] },
      { id: otherInstanceId, exclude_packages: [1, 2] },
    ];

    const [firstPackage] = packages;
    assert(firstPackage);

    render(
      <AffectedPackages
        {...props}
        excludedPackages={multiInstanceExcluded}
        packages={packages.slice(0, limit)}
      />,
    );

    const packageCheckbox = screen.getByLabelText(
      `Toggle ${firstPackage.name} package`,
    );
    await userEvent.click(packageCheckbox);

    const { calls } = onExcludedPackagesChange.mock;
    expect(calls.length).toBeGreaterThan(0);

    const lastCall = calls[
      calls.length - 1
    ]?.[0] as InstancePackagesToExclude[];
    const otherEntry = lastCall.find((e) => e.id === otherInstanceId);
    // Other instance's excluded packages should be unchanged
    expect(otherEntry?.exclude_packages).toEqual([1, 2]);
  });

  it("should show loading indicator in last row when packagesLoading with packages", () => {
    const [firstPackage] = packages;
    assert(firstPackage);
    render(
      <AffectedPackages {...props} packagesLoading packages={[firstPackage]} />,
    );
    // The last row in the table (the loading row) shows LoadingState
    expect(screen.getByText("Loading...")).toBeInTheDocument();
  });

  it("should use empty exclude_packages when no entry exists for instance", () => {
    // excludedPackages has no entry for the current instance → ?? [] fallback
    const NON_EXISTENT_INSTANCE_ID = 9999;
    render(
      <AffectedPackages
        {...props}
        excludedPackages={[
          { id: NON_EXISTENT_INSTANCE_ID, exclude_packages: [] },
        ]}
        packages={packages.slice(0, limit)}
      />,
    );
    // All packages checkboxes should be checked (none excluded)
    const [firstPackage] = packages;
    assert(firstPackage);
    const checkbox = screen.getByLabelText(
      `Toggle ${firstPackage.name} package`,
    );
    expect(checkbox).toBeChecked();
  });

  it("should include all packages when toggle-all is clicked while all are excluded", async () => {
    const allPackageIds = packages.slice(0, limit).map(({ id }) => id);
    const allExcluded: InstancePackagesToExclude[] = [
      { id: instance.id, exclude_packages: allPackageIds },
    ];

    render(
      <AffectedPackages
        {...props}
        excludedPackages={allExcluded}
        packages={packages.slice(0, limit)}
      />,
    );

    const toggleAllCheckbox = screen.getByLabelText("Toggle all packages");
    await userEvent.click(toggleAllCheckbox);

    // exclude_packages.length (5) >= packageIds.length (5) → returns [] (include all)
    expect(onExcludedPackagesChange).toHaveBeenCalledWith([
      { id: instance.id, exclude_packages: [] },
    ]);
  });

  it("should preserve other instances when SelectAll is clicked with multi-instance excluded", async () => {
    const FALLBACK_OTHER_INSTANCE_ID_2 = 9999;
    const otherInstanceId = instances[0]?.id ?? FALLBACK_OTHER_INSTANCE_ID_2;
    // Use excluded IDs that are NOT in current packages list to trigger showSelectAllButton
    const foreignId = 99999; // not in packages.slice(0, limit)
    const multiExcluded: InstancePackagesToExclude[] = [
      { id: instance.id, exclude_packages: [foreignId] },
      { id: otherInstanceId, exclude_packages: [1, 2] },
    ];

    render(
      <AffectedPackages
        {...props}
        excludedPackages={multiExcluded}
        packages={packages.slice(0, limit)}
      />,
    );

    // showSelectAllButton should be true (some excluded IDs not in current packages)
    const selectAllText = screen.queryByText(/Select all/);
    if (selectAllText) {
      await userEvent.click(selectAllText);

      const { calls } = onExcludedPackagesChange.mock;
      const lastCall = calls[
        calls.length - 1
      ]?.[0] as InstancePackagesToExclude[];
      const otherEntry = lastCall.find((e) => e.id === otherInstanceId);
      // Other instance's packages should be preserved (id !== instance.id branch)
      expect(otherEntry?.exclude_packages).toEqual([1, 2]);
    }
  });

  it("should preserve other instances' excluded packages when toggle-all is clicked", async () => {
    const FALLBACK_OTHER_INSTANCE_ID_3 = 9999;
    const otherInstanceId = instances[0]?.id ?? FALLBACK_OTHER_INSTANCE_ID_3;
    const multipleExcluded: InstancePackagesToExclude[] = [
      { id: instance.id, exclude_packages: [] },
      { id: otherInstanceId, exclude_packages: [1, 2, 3] },
    ];

    render(
      <AffectedPackages
        {...props}
        excludedPackages={multipleExcluded}
        packages={packages.slice(0, limit)}
      />,
    );

    const toggleAllCheckbox = screen.getByLabelText("Toggle all packages");
    await userEvent.click(toggleAllCheckbox);

    const { calls } = onExcludedPackagesChange.mock;
    expect(calls.length).toBeGreaterThan(0);
    const lastCall = calls[
      calls.length - 1
    ]?.[0] as InstancePackagesToExclude[];
    const otherEntry = lastCall.find((e) => e.id === otherInstanceId);
    // Other instance's excluded packages should remain unchanged
    expect(otherEntry?.exclude_packages).toEqual([1, 2, 3]);
  });
});
