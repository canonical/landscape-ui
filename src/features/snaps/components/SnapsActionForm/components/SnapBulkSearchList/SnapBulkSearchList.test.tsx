import { installedSnaps } from "@/tests/mocks/snap";
import { renderWithProviders } from "@/tests/render";
import { fireEvent, screen } from "@testing-library/react";
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
  getMenuProps: vi.fn().mockReturnValue({}),
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
            previous: null,
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

  it("shows the publisher display name when present", () => {
    renderList({ queryResult: buildQueryResult([thirdSnap]) });

    expect(screen.getByText("Canonical")).toBeInTheDocument();
  });

  describe("infinite scroll", () => {
    const getList = (container: HTMLElement) => {
      const list = container.querySelector("ul");
      assert(list);
      return list;
    };

    it("fetches the next page when scrolled near the bottom", () => {
      const fetchNextPage = vi.fn();
      const { container } = renderList({
        queryResult: buildQueryResult(snaps, {
          hasNextPage: true,
          fetchNextPage,
        }),
      });

      fireEvent.scroll(getList(container));

      expect(fetchNextPage).toHaveBeenCalledOnce();
    });

    it("does not fetch the next page when not near the bottom", () => {
      const fetchNextPage = vi.fn();
      const { container } = renderList({
        queryResult: buildQueryResult(snaps, {
          hasNextPage: true,
          fetchNextPage,
        }),
      });

      const list = getList(container);
      Object.defineProperty(list, "scrollHeight", {
        value: 100,
        configurable: true,
      });
      Object.defineProperty(list, "clientHeight", {
        value: 50,
        configurable: true,
      });
      Object.defineProperty(list, "scrollTop", {
        value: 20,
        configurable: true,
      });

      fireEvent.scroll(list);

      expect(fetchNextPage).not.toHaveBeenCalled();
    });

    it("does not fetch the next page when there is no next page", () => {
      const fetchNextPage = vi.fn();
      const { container } = renderList({
        queryResult: buildQueryResult(snaps, {
          hasNextPage: false,
          fetchNextPage,
        }),
      });

      fireEvent.scroll(getList(container));

      expect(fetchNextPage).not.toHaveBeenCalled();
    });

    it("does not fetch the next page while one is already loading", () => {
      const fetchNextPage = vi.fn();
      const { container } = renderList({
        queryResult: buildQueryResult(snaps, {
          hasNextPage: true,
          isFetchingNextPage: true,
          fetchNextPage,
        }),
      });

      fireEvent.scroll(getList(container));

      expect(fetchNextPage).not.toHaveBeenCalled();
    });

    it("shows a loading indicator while fetching the next page", () => {
      renderList({
        queryResult: buildQueryResult(snaps, {
          hasNextPage: true,
          isFetchingNextPage: true,
        }),
      });

      expect(screen.getByRole("status")).toBeInTheDocument();
    });
  });
});
