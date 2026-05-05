import { renderWithProviders } from "@/tests/render";
import { describe, it, expect } from "vitest";
import LocalRepositoriesList from "./LocalRepositoriesList";
import { repositories } from "@/tests/mocks/localRepositories";
import { getAllByRole, screen } from "@testing-library/react";
import { NO_DATA_TEXT } from "@/components/layout/NoData";
import userEvent from "@testing-library/user-event";

describe("LocalRepositoriesList", () => {
  const user = userEvent.setup();

  it("renders table with column headers and pagination", () => {
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
    expect(
      screen.getByRole("columnheader", { name: "Actions" }),
    ).toBeInTheDocument();

    expect(screen.getByText(/showing.*of/i)).toBeInTheDocument();
  });

  it("renders repositories as buttons", () => {
    renderWithProviders(<LocalRepositoriesList repositories={repositories} />);

    expect(screen.getByRole("button", { name: "repo 1" })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "repo 2" })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "repo 3" })).toBeInTheDocument();
  });

  it("renders descriptions in rows", () => {
    renderWithProviders(<LocalRepositoriesList repositories={repositories} />);

    expect(screen.getByText(NO_DATA_TEXT)).toBeInTheDocument();
    expect(screen.getByText("repo 2 description")).toBeInTheDocument();
    expect(screen.getByText("repo 3 description")).toBeInTheDocument();
  });

  it("renders empty message when no repositories", () => {
    renderWithProviders(<LocalRepositoriesList repositories={[]} />);

    expect(
      screen.getByText(/no local repositories found with the search/i),
    ).toBeInTheDocument();
  });

  it("renders action buttons for each repository", async () => {
    renderWithProviders(<LocalRepositoriesList repositories={repositories} />);

    const actionButtons = screen.getAllByRole("button", { name: /actions/i });
    expect(actionButtons).toHaveLength(repositories.length);
    assert(actionButtons[0]);

    await user.click(actionButtons[0]);

    const dropdown = await screen.findByRole("menu");
    expect(getAllByRole(dropdown, "menuitem")).toHaveLength(5);
  });
});
