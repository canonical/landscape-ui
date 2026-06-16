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
      await screen.findByRole("link", {
        name: "Switch to classic dashboard",
      }),
    ).toBeInTheDocument();
  });

  it("should have the old dashboard url", async () => {
    expect(
      await screen.findByRole("link", { name: "Switch to classic dashboard" }),
    ).toHaveAttribute("href", "https://old-dashboard-url");
  });
});
