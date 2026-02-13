import { renderWithProviders } from "@/tests/render";
import { screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import LandscapeActions from "./LandscapeActions";
import { FEEDBACK_LINK } from "@/constants";

const redirectToExternalUrl = vi.hoisted(() => vi.fn());

vi.mock("@/features/auth", async (importOriginal) => ({
  ...(await importOriginal()),
  redirectToExternalUrl,
}));

describe("LandscapeActions", () => {
  beforeEach(() => {
    renderWithProviders(<LandscapeActions />);
  });

  it("should render Landscape version and action buttons", async () => {
    expect(
      screen.getByRole("link", { name: "Share your feedback" }),
    ).toHaveProperty("href", FEEDBACK_LINK);
    expect(
      screen.getByRole("button", { name: "Switch to classic dashboard" }),
    ).toBeInTheDocument();
  });

  it("should be redirected to old dashboard", async () => {
    await userEvent.click(
      screen.getByRole("button", { name: "Switch to classic dashboard" }),
    );

    expect(redirectToExternalUrl).toHaveBeenCalledWith(
      "https://old-dashboard-url",
    );
  });
});
