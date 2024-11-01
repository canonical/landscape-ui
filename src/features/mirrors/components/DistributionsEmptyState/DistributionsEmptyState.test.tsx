import { renderWithProviders } from "@/tests/render";
import { screen } from "@testing-library/react";
import DistributionsEmptyState from "./DistributionsEmptyState";
import userEvent from "@testing-library/user-event";

describe("DistributionsEmptyState", () => {
  it("renders empty state", () => {
    const { container } = renderWithProviders(<DistributionsEmptyState />);

    expect(container).toHaveTexts([
      "No mirrors have been added yet",
      "To add a new mirror you must first add a distribution",
      "How to manage repositories in Landscape",
    ]);

    expect(
      screen.getByRole("button", { name: /add distribution/i }),
    ).toBeVisible();
  });

  it("opens sidepanel form", async () => {
    renderWithProviders(<DistributionsEmptyState />);

    await userEvent.click(
      screen.getByRole("button", { name: /add distribution/i }),
    );

    const formTitle = await screen.findByRole("heading", {
      name: /add distribution/i,
    });
    expect(formTitle).toBeVisible();
  });
});
