import { renderWithProviders } from "@/tests/render";
import { describe, it, expect } from "vitest";
import LocalRepositoriesList from "./LocalRepositoriesList";
import { repositories } from "@/tests/mocks/localRepositories";
import { screen } from "@testing-library/react";

describe("LocalRepositoriesList", () => {
  it("renders table with column headers", () => {
    renderWithProviders(<LocalRepositoriesList repositories={repositories} />);

    expect(
      screen.getByRole("columnheader", { name: "Name" }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("columnheader", { name: "Description" }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("columnheader", { name: "Packages" }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("columnheader", { name: "Publications" }),
    ).toBeInTheDocument();
  });

  it("renders repositories as buttons", () => {
    renderWithProviders(<LocalRepositoriesList repositories={repositories} />);

    expect(screen.getByRole("button", { name: "repo 1" })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "repo 2" })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "repo 3" })).toBeInTheDocument();
  });

  it("renders descriptions in rows", () => {
    renderWithProviders(<LocalRepositoriesList repositories={repositories} />);

    expect(screen.getByText("repo 2 description")).toBeInTheDocument();
    expect(screen.getByText("repo 3 description")).toBeInTheDocument();
  });

  it("renders empty message when no repositories", () => {
    renderWithProviders(<LocalRepositoriesList repositories={[]} />);

    expect(
      screen.getByText(/no local repositories found with the search/i),
    ).toBeInTheDocument();
  });

  it("renders pagination info", () => {
    renderWithProviders(<LocalRepositoriesList repositories={repositories} />);

    expect(screen.getByText(/showing.*of/i)).toBeInTheDocument();
  });

  it("renders action buttons for each repository", () => {
    renderWithProviders(<LocalRepositoriesList repositories={repositories} />);

    const actionButtons = screen.getAllByRole("button", { name: /actions/i });
    expect(actionButtons.length).toBeGreaterThan(0);
  });
});
