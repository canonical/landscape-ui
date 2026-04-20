import { screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { beforeEach, describe, expect, it } from "vitest";
import { PATHS, ROUTES } from "@/libs/routes";
import { setEndpointStatus } from "@/tests/controllers/controller";
import { renderWithProviders } from "@/tests/render";
import APTSourcesPage from "./APTSourcesPage";
import { APT_SOURCES_DOCS_URL } from "./constants";

describe("APTSourcesPage", () => {
  beforeEach(() => {
    setEndpointStatus("default");
  });

  it("renders apt sources list", async () => {
    renderWithProviders(<APTSourcesPage />);

    expect(
      screen.getByRole("heading", { name: "APT sources" }),
    ).toBeInTheDocument();
    expect(await screen.findByText("source1")).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: "Add APT source" }),
    ).toBeInTheDocument();
  });

  it("shows empty state when no apt sources are returned", async () => {
    setEndpointStatus({ status: "empty", path: "repository/apt-source" });

    renderWithProviders(
      <APTSourcesPage />,
      undefined,
      ROUTES.repositories.aptSources(),
      `/${PATHS.repositories.root}/${PATHS.repositories.aptSources}`,
    );

    expect(await screen.findByText("No APT sources found")).toBeInTheDocument();
    expect(
      screen.getByRole("link", {
        name: "How to manage APT sources in Landscape",
      }),
    ).toHaveAttribute("href", APT_SOURCES_DOCS_URL);
  });

  it("opens add apt source side panel from page action", async () => {
    const user = userEvent.setup();

    renderWithProviders(
      <APTSourcesPage />,
      undefined,
      ROUTES.repositories.aptSources(),
      `/${PATHS.repositories.root}/${PATHS.repositories.aptSources}`,
    );

    await user.click(screen.getByRole("button", { name: "Add APT source" }));

    expect(
      await screen.findByRole("heading", { name: "Add APT source" }),
    ).toBeInTheDocument();
  });
});
