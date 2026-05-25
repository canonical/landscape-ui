import { renderWithProviders } from "@/tests/render";
import { describe, it, expect } from "vitest";
import LocalRepositoryPackagesList from "./LocalRepositoryPackagesList";
import {
  paginatedPackages,
  sortedPackages,
} from "@/tests/mocks/localRepositories";
import { screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

describe("LocalRepositoryPackagesList", () => {
  it("renders table with default column header and paginated data", async () => {
    renderWithProviders(
      <LocalRepositoryPackagesList packages={paginatedPackages} />,
    );

    expect(
      await screen.findByRole("columnheader", { name: "Package name" }),
    ).toBeInTheDocument();

    for (const pkg of sortedPackages.slice(0, 10)) {
      expect(await screen.findByText(pkg)).toBeInTheDocument();
    }

    expect(await screen.findByText(/page 1 of 3/i)).toBeInTheDocument();
  });

  it("renders custom header when provided", async () => {
    renderWithProviders(
      <LocalRepositoryPackagesList
        packages={paginatedPackages}
        header="Packages to import"
      />,
    );

    expect(
      await screen.findByRole("columnheader", { name: "Packages to import" }),
    ).toBeInTheDocument();
  });

  it("renders empty message when no packages", async () => {
    renderWithProviders(<LocalRepositoryPackagesList packages={[]} />);

    expect(
      screen.getByText(/no packages associated with this local repository/i),
    ).toBeInTheDocument();
  });

  it("navigates to next page on click", async () => {
    const user = userEvent.setup();
    renderWithProviders(
      <LocalRepositoryPackagesList packages={paginatedPackages} />,
    );

    assert(sortedPackages[0]);
    assert(sortedPackages[10]);
    await screen.findByText(sortedPackages[0]);
    expect(screen.queryByText(sortedPackages[10])).not.toBeInTheDocument();

    const nextButton = screen.getByRole("button", { name: /next/i });
    await user.click(nextButton);

    expect(screen.getByText(sortedPackages[10])).toBeInTheDocument();
    expect(screen.queryByText(sortedPackages[0])).not.toBeInTheDocument();
  });

  it("navigates to previous page on click", async () => {
    const user = userEvent.setup();
    renderWithProviders(
      <LocalRepositoryPackagesList packages={paginatedPackages} />,
    );

    assert(sortedPackages[0]);
    assert(sortedPackages[10]);
    await screen.findByText(sortedPackages[0]);

    const nextButton = screen.getByRole("button", { name: /next/i });
    await user.click(nextButton);

    expect(screen.getByText(sortedPackages[10])).toBeInTheDocument();

    const prevButton = screen.getByRole("button", { name: /previous/i });
    await user.click(prevButton);

    expect(screen.getByText(sortedPackages[0])).toBeInTheDocument();
  });
});
