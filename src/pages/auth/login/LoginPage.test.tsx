import { describe } from "vitest";
import { screen } from "@testing-library/react";
import { renderWithProviders } from "@/tests/render";
import LoginPage from "./LoginPage";

describe("LoginPage", () => {
  it("should render", async () => {
    renderWithProviders(<LoginPage />);

    expect(screen.getByText("Sign in to Landscape")).toBeInTheDocument();
  });
});
