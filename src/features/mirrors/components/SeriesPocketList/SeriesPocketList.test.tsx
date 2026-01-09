import { distributions } from "@/tests/mocks/distributions";
import { renderWithProviders } from "@/tests/render";
import { screen } from "@testing-library/react";
import type { ComponentProps } from "react";
import { vi } from "vitest";
import SeriesPocketList from "./SeriesPocketList";

const series = distributions.find((d) => d.series.length > 0)?.series[0];
assert(series);

const props: ComponentProps<typeof SeriesPocketList> = {
  distributionName: "Ubuntu",
  series,
  syncPocketRefAdd: vi.fn(),
  syncPocketRefs: [],
};

describe("SeriesPocketList", () => {
  it("renders table series pocket list for big screens", () => {
    const { container } = renderWithProviders(<SeriesPocketList {...props} />);

    const table = screen.getByRole("table");
    expect(table).toBeVisible();

    expect(container).toHaveTexts(["Pocket", "Mode", "Last synced", "Content"]);
  });
});
