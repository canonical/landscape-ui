import { installedSnaps } from "@/tests/mocks/snap";
import { renderWithProviders } from "@/tests/render";
import { screen } from "@testing-library/react";
import type { ControllerStateAndHelpers } from "downshift";
import type { ComponentProps } from "react";
import { describe, expect, it, vi } from "vitest";
import type { InstalledSnapWithCount } from "../../../../types";
import SnapBulkSearchList from "./SnapBulkSearchList";

type QueryResult = ComponentProps<typeof SnapBulkSearchList>["queryResult"];

const snaps = installedSnaps.slice(0, 3);
const [firstSnap, secondSnap, thirdSnap] = installedSnaps;

const downshiftOptions = {
  highlightedIndex: -1,
  getItemProps: vi.fn().mockReturnValue({}),
} as unknown as ControllerStateAndHelpers<InstalledSnapWithCount>;

const buildQueryResult = (
  results: InstalledSnapWithCount[] = installedSnaps,
  overrides: Partial<QueryResult> = {},
): QueryResult =>
  ({
    isPending: false,
    isFetchingNextPage: false,
    hasNextPage: false,
    fetchNextPage: vi.fn(),
    data: {
      pageParams: [0],
      pages: [
        {
          data: {
            results,
            count: results.length,
            prev: null,
            next: null,
          },
        },
      ],
    },
    ...overrides,
  }) as unknown as QueryResult;

const renderList = (
  props: Partial<ComponentProps<typeof SnapBulkSearchList>> = {},
) =>
  renderWithProviders(
    <SnapBulkSearchList
      downshiftOptions={downshiftOptions}
      queryResult={buildQueryResult()}
      search=""
      selectedSnaps={[]}
      {...props}
    />,
  );

describe("SnapBulkSearchList", () => {
  it("renders list of snaps when query is completed", () => {
    renderList();

    for (const item of snaps) {
      expect(screen.getByText(item.snap.name)).toBeInTheDocument();
    }
  });

  it("hides selected snaps disabled from dropdown", () => {
    renderList({ selectedSnaps: [firstSnap] });

    expect(screen.queryByText(firstSnap.snap.name)).not.toBeInTheDocument();

    expect(screen.getByText(secondSnap.snap.name)).toBeInTheDocument();
    expect(screen.getByText(thirdSnap.snap.name)).toBeInTheDocument();
  });

  it("renders bold text for searched term", () => {
    renderList({
      search: firstSnap.snap.name,
      queryResult: buildQueryResult([firstSnap]),
    });

    expect(screen.getByRole("strong")).toHaveTextContent(firstSnap.snap.name);
  });

  it("renders empty message", () => {
    renderList({ queryResult: buildQueryResult([]) });

    expect(screen.getByText("No snaps found.")).toBeInTheDocument();
  });

  it("renders loading when query is pending", () => {
    renderList({
      queryResult: buildQueryResult(snaps, {
        isPending: true,
        data: undefined,
      }),
    });

    expect(screen.getByRole("status")).toBeInTheDocument();
  });
});
