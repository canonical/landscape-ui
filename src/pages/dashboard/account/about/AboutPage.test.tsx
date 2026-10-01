import { API_URL } from "@/constants";
import { EnvContext } from "@/context/env";
import { renderWithProviders } from "@/tests/render";
import server from "@/tests/server";
import { screen } from "@testing-library/react";
import { http, HttpResponse } from "msw";
import { describe, expect, it } from "vitest";
import AboutPage from "./AboutPage";

describe("AboutPage", () => {
  it("renders the About page title", async () => {
    renderWithProviders(<AboutPage />);

    expect(screen.getByRole("heading", { name: "About" })).toBeInTheDocument();
    expect(await screen.findByRole("separator")).toHaveClass("p-rule--muted");
  });

  it("renders fallback server details when the about request fails", async () => {
    server.use(
      http.get(`${API_URL}about`, () =>
        HttpResponse.json({ message: "Not found" }, { status: 404 }),
      ),
    );

    const { container } = renderWithProviders(
      <>
        <AboutPage />
        <EnvContext.Consumer>
          {({ envLoading, envError }) => (
            <span data-testid="environment-state">
              {`${envLoading},${envError}`}
            </span>
          )}
        </EnvContext.Consumer>
      </>,
    );

    expect(
      await screen.findByRole("heading", { name: "Server version" }),
    ).toBeInTheDocument();
    expect(screen.getByTestId("environment-state")).toHaveTextContent(
      "true,true",
    );
    expect(container).toHaveInfoItem("Package version", "unknown");
    expect(container).toHaveInfoItem("Revision", "unknown");
    expect(screen.queryByRole("status")).not.toBeInTheDocument();
  });
});
