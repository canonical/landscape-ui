import { distributions } from "@/tests/mocks/distributions";
import { renderWithProviders } from "@/tests/render";
import { screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { ComponentProps } from "react";
import EmptyDistribution from "./EmptyDistribution";

const props: ComponentProps<typeof EmptyDistribution> = {
  distribution: distributions[0],
};

describe("EmptyDistribution", () => {
  it("renders empty state", () => {
    const { container } = renderWithProviders(<EmptyDistribution {...props} />);

    expect(container).toHaveTexts([
      "No series have been added yet",
      "Add a new mirror or series to get started",
      "How to manage repositories in Landscape",
    ]);

    expect(
      screen.getByRole("button", {
        name: /add mirror/i,
      }),
    ).toBeVisible();
  });

  it("opens sidepanel form", async () => {
    renderWithProviders(<EmptyDistribution {...props} />);

    await userEvent.click(screen.getByRole("button", { name: /add mirror/i }));

    const formTitle = await screen.findByRole("heading", {
      name: `Add mirror for ${props.distribution.name}`,
    });
    expect(formTitle).toBeVisible();
  });
});
