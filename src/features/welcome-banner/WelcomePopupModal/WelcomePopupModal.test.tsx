import { screen } from "@testing-library/react";
import WelcomePopupModal from "./WelcomePopupModal";
import { renderWithProviders } from "@/tests/render";
import userEvent from "@testing-library/user-event";

const hideBanner = vi.fn();

describe("WelcomePopupModal", () => {
  beforeEach(() => {
    renderWithProviders(<WelcomePopupModal hideBanner={hideBanner} />);
  });

  it("should render", async () => {
    expect(
      screen.getByText("Landscape web portal (Preview)"),
    ).toBeInTheDocument();
  });

  it("should close by button", async () => {
    await userEvent.click(screen.getByRole("button", { name: /got it!/i }));

    expect(hideBanner).toHaveBeenCalled();
  });

  it("should close by close icon", async () => {
    await userEvent.click(
      screen.getByRole("button", {
        name: /close active modal/i,
      }),
    );

    expect(hideBanner).toHaveBeenCalled();
  });
});
