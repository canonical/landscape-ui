import { API_URL } from "@/constants";
import { renderWithProviders } from "@/tests/render";
import server from "@/tests/server";
import { screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { http, HttpResponse } from "msw";
import { describe, expect, it } from "vitest";
import AboutPage from "./AboutPage";

describe("AboutPage", () => {
  it("renders the About page title", async () => {
    renderWithProviders(<AboutPage />);

    expect(screen.getByRole("heading", { name: "About" })).toBeInTheDocument();
    expect(await screen.findByRole("separator")).toHaveClass("p-rule--muted");
  });

  it("shows a dismissible notification when environment loading fails", async () => {
    server.use(
      http.get(`${API_URL}about`, () =>
        HttpResponse.json(
          {
            error: "ServiceUnavailable",
            message: "Server information is unavailable",
          },
          { status: 503 },
        ),
      ),
    );
    const user = userEvent.setup();

    renderWithProviders(<AboutPage />);

    expect(
      await screen.findByText("Server information is unavailable"),
    ).toBeInTheDocument();
    expect(screen.getByRole("status")).toHaveTextContent("Loading...");
    expect(
      screen.queryByRole("heading", { name: "UI version" }),
    ).not.toBeInTheDocument();

    await user.click(
      screen.getByRole("button", { name: "Close notification" }),
    );

    expect(
      screen.queryByText("Server information is unavailable"),
    ).not.toBeInTheDocument();
    expect(screen.getByRole("status")).toHaveTextContent("Loading...");
  });
});
