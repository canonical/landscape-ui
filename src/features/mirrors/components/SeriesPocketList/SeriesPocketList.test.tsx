import { distributions } from "@/tests/mocks/distributions";
import { renderWithProviders } from "@/tests/render";
import { screen } from "@testing-library/react";
import { ComponentProps } from "react";
import { vi } from "vitest";
import SeriesPocketList from "./SeriesPocketList";
import { resetScreenSize, setScreenSize } from "@/tests/helpers";

const props: ComponentProps<typeof SeriesPocketList> = {
  distributionName: "Ubuntu",
  series:
    distributions.find((d) => d.series.length > 0)?.series[0] ??
    distributions[0].series[0],
  syncPocketRefAdd: vi.fn(),
  syncPocketRefs: [],
};

describe("SeriesPocketList", () => {
  afterEach(() => {
    resetScreenSize();
  });
  it("renders table series pocket list for big screens", () => {
    setScreenSize("large");

    const { container } = renderWithProviders(<SeriesPocketList {...props} />);

    const table = screen.getByRole("table");
    expect(table).toBeVisible();

    expect(container).toHaveTexts(["Pocket", "Mode", "Last synced", "Content"]);
  });

  it("renders table series pocket list for small screens", () => {
    setScreenSize("small");

    renderWithProviders(<SeriesPocketList {...props} />);

    const table = screen.queryByRole("table");
    expect(table).not.toBeInTheDocument();

    const pocketRowsLength = screen.getAllByText("Pocket").length;
    expect(pocketRowsLength).toEqual(props.series.pockets.length);
  });
});
