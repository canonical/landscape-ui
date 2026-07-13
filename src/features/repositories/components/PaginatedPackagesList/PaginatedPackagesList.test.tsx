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
  currentPage: 1,
  hasNextPage: false,
  onNextPage: vi.fn(),
  onPreviousPage: vi.fn(),
};

describe("PaginatedPackagesList", () => {
  it("renders the packages with the default header and data", () => {
    renderWithProviders(<PaginatedPackagesList {...props} />);

    expect(
      screen.getByRole("columnheader", { name: "Package name" }),
    ).toBeInTheDocument();
    expect(screen.getByText("package-1")).toBeInTheDocument();
    expect(screen.getByText("package-2")).toBeInTheDocument();
    expect(screen.getByText("package-3")).toBeInTheDocument();
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

  it("shows the exact number of pages when the count is exact", () => {
    renderWithProviders(
      <PaginatedPackagesList {...props} packagesCount={1000} hasNextPage />,
    );

    expect(screen.getByText("Page 1 of 100")).toBeInTheDocument();
  });

  it("marks the total as approximate when the count is limited", () => {
    renderWithProviders(
      <PaginatedPackagesList
        {...props}
        packagesCount={1000}
        isPackagesCountExact={false}
        hasNextPage
      />,
    );

    expect(screen.getByText(/page 1 of 100\+/i)).toBeInTheDocument();
  });

  it("marks the total as exact when there is no next page", () => {
    renderWithProviders(
      <PaginatedPackagesList
        {...props}
        packagesCount={1000}
        isPackagesCountExact={false}
        hasNextPage={false}
        currentPage={101}
      />,
    );

    expect(screen.getByText(/page 101 of 101/i)).toBeInTheDocument();
  });

  it("invokes the navigation callbacks", async () => {
    const user = userEvent.setup();

    renderWithProviders(
      <PaginatedPackagesList
        {...props}
        packagesCount={30}
        currentPage={2}
        hasNextPage
      />,
    );

    await user.click(screen.getByRole("button", { name: "Next page" }));
    expect(props.onNextPage).toHaveBeenCalled();

    await user.click(screen.getByRole("button", { name: "Previous page" }));
    expect(props.onPreviousPage).toHaveBeenCalled();
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
