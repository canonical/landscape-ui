import { API_URL } from "@/constants";
import { renderWithProviders } from "@/tests/render";
import { describe, it, expect } from "vitest";
import LocalRepositoriesList from "./LocalRepositoriesList";
import { repositories } from "@/tests/mocks/localRepositories";
import { features } from "@/tests/mocks/features";
import server from "@/tests/server";
import { generatePaginatedResponse } from "@/tests/server/handlers/_helpers";
import { getAllByRole, screen } from "@testing-library/react";
import { NO_DATA_TEXT } from "@/components/layout/NoData";
import userEvent from "@testing-library/user-event";
import { http, HttpResponse } from "msw";

describe("LocalRepositoriesList", () => {
  const user = userEvent.setup();

  it("renders table with column headers and pagination", async () => {
    renderWithProviders(<LocalRepositoriesList repositories={repositories} />);

    expect(
      screen.getByRole("columnheader", { name: "Name" }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("columnheader", { name: "Status" }),
    ).toBeInTheDocument();
    expect(
      await screen.findByRole("columnheader", { name: "Last import" }),
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

  it("hides the Last import column when the feature flag is disabled", async () => {
    server.use(
      http.get(`${API_URL}features`, () =>
        HttpResponse.json(
          generatePaginatedResponse({
            data: features.map((feature) =>
              feature.key === "local-repository-last-import"
                ? { ...feature, enabled: false }
                : feature,
            ),
            offset: 0,
            limit: 20,
          }),
        ),
      ),
    );

    renderWithProviders(<LocalRepositoriesList repositories={repositories} />);

    expect(
      await screen.findByRole("columnheader", { name: "Packages" }),
    ).toBeInTheDocument();
    expect(
      screen.queryByRole("columnheader", { name: "Last import" }),
    ).not.toBeInTheDocument();
  });

  it("renders repositories as buttons", () => {
    renderWithProviders(<LocalRepositoriesList repositories={repositories} />);

    for (const repository of repositories) {
      expect(
        screen.getByRole("button", { name: repository.displayName }),
      ).toBeInTheDocument();
    }
  });

  it("renders last import dates", async () => {
    renderWithProviders(<LocalRepositoriesList repositories={repositories} />);

    expect(await screen.findAllByText(/Jun \d{2}, 2024/)).toHaveLength(4);
    expect(screen.getByText(NO_DATA_TEXT)).toBeInTheDocument();
  });

  it("renders status for no operation", async () => {
    renderWithProviders(<LocalRepositoriesList repositories={repositories} />);

    expect(
      await screen.findByText("No packages imported yet"),
    ).toBeInTheDocument();
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
