import { renderWithProviders } from "@/tests/render";
import { screen } from "@testing-library/react";
import SeriesPocketDetailsButton from "./SeriesPocketDetailsButton";
import type { ComponentProps } from "react";
import { pockets } from "@/tests/mocks/pockets";

const propsWithMirrorPocket: ComponentProps<typeof SeriesPocketDetailsButton> =
  {
    distributionName: "Ubuntu",
    seriesName: "Focal Fossa",
    pocket: pockets.find((p) => p.mode === "mirror") ?? pockets[0],
  };

const propsWithPullPocket: ComponentProps<typeof SeriesPocketDetailsButton> = {
  distributionName: "Ubuntu",
  seriesName: "Focal Fossa",
  pocket: pockets.find((p) => p.mode === "pull") ?? pockets[0],
};

describe("SeriesPocketDetailsButton", () => {
  it("renders buttons for mirror pocket", () => {
    renderWithProviders(
      <SeriesPocketDetailsButton {...propsWithMirrorPocket} />,
    );

    expect(
      screen.getByRole("button", {
        name: `List ${propsWithMirrorPocket.pocket.name} pocket of ${propsWithMirrorPocket.distributionName}/${propsWithMirrorPocket.seriesName}`,
      }),
    ).toBeVisible();
    const pullingPocketText = screen.queryByText(/pulling from/i);
    expect(pullingPocketText).not.toBeInTheDocument();
  });

  it("renders buttons for pull pocket", () => {
    renderWithProviders(<SeriesPocketDetailsButton {...propsWithPullPocket} />);

    expect(
      screen.getByRole("button", {
        name: `List ${propsWithPullPocket.pocket.name} pocket of ${propsWithPullPocket.distributionName}/${propsWithPullPocket.seriesName}`,
      }),
    ).toBeVisible();
    const pullingPocketText = screen.getByText(/pulling from/i);
    expect(pullingPocketText).toBeVisible();
  });
});
