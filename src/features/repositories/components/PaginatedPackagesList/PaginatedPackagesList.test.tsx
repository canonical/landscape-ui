import { renderWithProviders } from "@/tests/render";
import { describe, it, expect, vi } from "vitest";
import { screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { AxiosError } from "axios";
import { AppErrorBoundary } from "@/components/layout/AppErrorBoundary";
import PaginatedPackagesList from "./PaginatedPackagesList";

const props = {
  packages: ["package-1", "package-2", "package-3"],
  packagesCount: 3,
  isPackagesCountExact: true,
  isGettingPackages: false,
  error: null,
  emptyMsg: "No packages found.",
  hasPreviousPage: true,
  hasNextPage: true,
  goToNextPage: vi.fn(),
  goToPreviousPage: vi.fn(),
};

describe("PaginatedPackagesList", () => {
  it("renders the packages with the header, data, and pagination", () => {
    renderWithProviders(<PaginatedPackagesList {...props} />);

    expect(
      screen.getByRole("columnheader", { name: "Package name" }),
    ).toBeInTheDocument();

    expect(screen.getByText("package-1")).toBeInTheDocument();
    expect(screen.getByText("package-2")).toBeInTheDocument();
    expect(screen.getByText("package-3")).toBeInTheDocument();

    expect(screen.getByText("Showing 3 of 3 packages")).toBeInTheDocument();
  });

  it("renders the empty message when there are no packages", () => {
    renderWithProviders(
      <PaginatedPackagesList {...props} packages={[]} packagesCount={0} />,
    );

    expect(screen.getByText("No packages found.")).toBeInTheDocument();
  });

  it("renders the loading state while fetching", () => {
    renderWithProviders(<PaginatedPackagesList {...props} isGettingPackages />);

    expect(screen.getByRole("status")).toBeInTheDocument();
  });

  it("invokes the navigation callbacks", async () => {
    const user = userEvent.setup();

    renderWithProviders(<PaginatedPackagesList {...props} />);

    await user.click(screen.getByRole("button", { name: "Next page" }));
    expect(props.goToNextPage).toHaveBeenCalled();

    await user.click(screen.getByRole("button", { name: "Previous page" }));
    expect(props.goToPreviousPage).toHaveBeenCalled();
  });

  it("renders the error fallback when there is an error", () => {
    renderWithProviders(
      <AppErrorBoundary>
        <PaginatedPackagesList {...props} error={new AxiosError("Failed")} />
      </AppErrorBoundary>,
    );

    expect(screen.getByText("Something went wrong")).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: "Try again" }),
    ).toBeInTheDocument();
  });
});
