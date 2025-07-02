import { renderWithProviders } from "@/tests/render";
import { screen } from "@testing-library/react";
import NewDistributionForm from "./NewDistributionForm";

describe("NewDistributionForm", () => {
  it("renders form fields for mirror pocket", () => {
    const { container } = renderWithProviders(<NewDistributionForm />);
    expect(container).toHaveTexts(["Distribution name", "Access group"]);

    expect(
      screen.getByRole("button", {
        name: /add distribution/i,
      }),
    ).toBeVisible();
  });
});
