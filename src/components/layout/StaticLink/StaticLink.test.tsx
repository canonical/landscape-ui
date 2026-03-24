import { renderWithProviders } from "@/tests/render";
import { screen } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import StaticLink from "./StaticLink";

describe("StaticLink", () => {
  it("renders a link with the given text", () => {
    renderWithProviders(<StaticLink to="/some-path">Click here</StaticLink>);
    expect(
      screen.getByRole("link", { name: "Click here" }),
    ).toBeInTheDocument();
  });

  it("renders the correct href", () => {
    renderWithProviders(<StaticLink to="/about">About</StaticLink>);
    expect(screen.getByRole("link", { name: "About" })).toHaveAttribute(
      "href",
      "/about",
    );
  });
});
