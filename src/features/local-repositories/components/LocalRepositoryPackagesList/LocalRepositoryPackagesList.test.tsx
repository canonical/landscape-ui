import { renderWithProviders } from "@/tests/render";
import { describe, it, expect } from "vitest";
import LocalRepositoryPackagesList from "./LocalRepositoryPackagesList";
import { paginatedPackages } from "@/tests/mocks/localRepositories";
import { screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

const singlePagePackages = paginatedPackages.slice(0, 10);

describe("LocalRepositoryPackagesList", () => {
  it("renders table with default column header", async () => {
    renderWithProviders(
      <LocalRepositoryPackagesList packages={singlePagePackages} />,
    );

    expect(
      await screen.findByRole("columnheader", { name: "Package name" }),
    ).toBeInTheDocument();
  });

  it("renders custom header when provided", async () => {
    renderWithProviders(
      <LocalRepositoryPackagesList
        packages={singlePagePackages}
        header="Packages to import"
      />,
    );

    expect(
      await screen.findByRole("columnheader", { name: "Packages to import" }),
    ).toBeInTheDocument();
  });

  it("renders package names in table rows", async () => {
    renderWithProviders(
      <LocalRepositoryPackagesList packages={singlePagePackages} />,
    );

    expect(await screen.findByText("package-1")).toBeInTheDocument();
    expect(screen.getByText("package-2")).toBeInTheDocument();
  });

  it("renders empty message when no packages", async () => {
    renderWithProviders(<LocalRepositoryPackagesList packages={[]} />);

    expect(
      screen.getByText(/no packages associated with this local repository/i),
    ).toBeInTheDocument();
  });

  it("renders pagination info if more than 1 page", async () => {
    renderWithProviders(
      <LocalRepositoryPackagesList packages={paginatedPackages} />,
    );

    expect(await screen.findByText(/page 1 of 3/i)).toBeInTheDocument();
  });

  it("navigates to next page on click", async () => {
    const user = userEvent.setup();
    renderWithProviders(
      <LocalRepositoryPackagesList packages={paginatedPackages} />,
    );

    await screen.findByText("package-1");
    expect(screen.queryByText("package-11")).not.toBeInTheDocument();

    const nextButton = screen.getByRole("button", { name: /next/i });
    await user.click(nextButton);

    expect(screen.getByText("package-11")).toBeInTheDocument();
    expect(screen.queryByText("package-1")).not.toBeInTheDocument();
  });

  it("navigates to previous page on click", async () => {
    const user = userEvent.setup();
    renderWithProviders(
      <LocalRepositoryPackagesList packages={paginatedPackages} />,
    );

    await screen.findByText("package-1");

    const nextButton = screen.getByRole("button", { name: /next/i });
    await user.click(nextButton);

    expect(screen.getByText("package-11")).toBeInTheDocument();

    const prevButton = screen.getByRole("button", { name: /previous/i });
    await user.click(prevButton);

    expect(screen.getByText("package-1")).toBeInTheDocument();
  });
});
