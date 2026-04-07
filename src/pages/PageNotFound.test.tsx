import { screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { PATHS } from "@/libs/routes";
import { renderWithProviders } from "@/tests/render";
import PageNotFound from "./PageNotFound";

describe("PageNotFound", () => {
  it("renders not found content and home link", () => {
    renderWithProviders(<PageNotFound />);

    expect(screen.getByText("Page not found")).toBeInTheDocument();
    expect(
      screen.getByText("It seems that page you're looking for doesn't exist."),
    ).toBeInTheDocument();

    const homeLink = screen.getByRole("link", {
      name: "Go back to the home page",
    });
    expect(homeLink).toHaveAttribute("href", PATHS.root.root);
  });
});
