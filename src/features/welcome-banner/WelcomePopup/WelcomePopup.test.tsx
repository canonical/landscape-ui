import { renderWithProviders } from "@/tests/render";
import WelcomePopup from "@/features/welcome-banner";
import { screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

describe("WelcomePopup", () => {
  afterEach(() => {
    localStorage.clear();
  });

  it("should render by default", async () => {
    renderWithProviders(<WelcomePopup />);

    await waitFor(() => {
      expect(
        screen.queryByText("Landscape web portal (Preview)"),
      ).toBeInTheDocument();
    });
  });

  it("should not render if saved in local storage", async () => {
    localStorage.setItem("_landscape_isWelcomePopupClosed", "true");

    renderWithProviders(<WelcomePopup />);

    expect(
      screen.queryByText("Landscape web portal (Preview)"),
    ).not.toBeInTheDocument();
  });

  it("should close and save in local storage", async () => {
    renderWithProviders(<WelcomePopup />);

    await waitFor(async () => {
      const closeButton = screen.getByRole("button", {
        name: /got it!/i,
      });

      expect(closeButton).toBeInTheDocument();

      await userEvent.click(closeButton);

      expect(
        screen.queryByText("Landscape web portal (Preview)"),
      ).not.toBeInTheDocument();

      expect(localStorage.getItem("_landscape_isWelcomePopupClosed")).toBe(
        "true",
      );
    });
  });
});
