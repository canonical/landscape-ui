import { pockets } from "@/tests/mocks/pockets";
import { renderWithProviders } from "@/tests/render";
import { screen } from "@testing-library/react";
import type { ComponentProps } from "react";
import SeriesPocketDetailsButton from "./SeriesPocketDetailsButton";

const mirrorPocket = pockets.find((p) => p.mode === "mirror");
assert(mirrorPocket);
const propsWithMirrorPocket: ComponentProps<typeof SeriesPocketDetailsButton> =
  {
    distributionName: "Ubuntu",
    seriesName: "Focal Fossa",
    pocket: mirrorPocket,
  };

const pullPocket = pockets.find((p) => p.mode === "pull");
assert(pullPocket);
const propsWithPullPocket: ComponentProps<typeof SeriesPocketDetailsButton> = {
  distributionName: "Ubuntu",
  seriesName: "Focal Fossa",
  pocket: pullPocket,
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
