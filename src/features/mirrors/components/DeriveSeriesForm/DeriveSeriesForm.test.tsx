import { renderWithProviders } from "@/tests/render";
import { screen } from "@testing-library/react";
import DeriveSeriesForm from "./DeriveSeriesForm";
import type { ComponentProps } from "react";
import { distributions } from "@/tests/mocks/distributions";

const props: ComponentProps<typeof DeriveSeriesForm> = {
  distribution: distributions[0],
  origin: "focal",
};

describe("DeriveSeriesForm", () => {
  it("renders form fields", () => {
    const { container } = renderWithProviders(<DeriveSeriesForm {...props} />);

    expect(container).toHaveTexts(["Series name"]);

    const informationText = screen.getByText(
      `You are deriving ${props.distribution.name}/${props.origin}.`,
    );
    expect(informationText).toBeVisible();

    const deriveSeriesButton = screen.getByRole("button", {
      name: /derive series/i,
    });
    expect(deriveSeriesButton).toBeInTheDocument();
  });
});
