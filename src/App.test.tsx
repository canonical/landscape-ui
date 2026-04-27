import { screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { renderWithProviders } from "@/tests/render";
import App from "./App";

describe("App", () => {
  it("renders not found route for unknown path", async () => {
    renderWithProviders(<App />, undefined, "/does-not-exist");

    expect(await screen.findByText("Page not found")).toBeInTheDocument();
    expect(
      screen.getByRole("link", { name: "Go back to the home page" }),
    ).toBeInTheDocument();
  });
});
