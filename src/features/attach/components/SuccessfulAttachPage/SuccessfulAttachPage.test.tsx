import { screen } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import { renderWithProviders } from "@/tests/render";
import SuccessfulAttachPage from "./SuccessfulAttachPage";

describe("SuccessfulAttachPage", () => {
  it("renders 'Sign in successful' title", () => {
    renderWithProviders(<SuccessfulAttachPage />);

    expect(
      screen.getByRole("heading", { name: /sign in successful/i }),
    ).toBeInTheDocument();
  });

  it("renders informational message about closing the tab", () => {
    renderWithProviders(<SuccessfulAttachPage />);

    expect(screen.getByText(/you can close this tab/i)).toBeInTheDocument();
  });
});
