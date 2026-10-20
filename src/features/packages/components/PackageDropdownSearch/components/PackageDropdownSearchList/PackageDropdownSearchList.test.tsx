import type { Package, SearchPackagesResponse } from "@/features/packages";
import { mockIntersectionObserver } from "@/tests/helpers";
import { packages } from "@/tests/mocks/packages";
import { renderWithProviders } from "@/tests/render";
import type {
  InfiniteData,
  UseInfiniteQueryResult,
} from "@tanstack/react-query";
import { screen } from "@testing-library/react";
import { AxiosHeaders, type AxiosResponse } from "axios";
import type { ControllerStateAndHelpers } from "downshift";
import type { ComponentProps } from "react";
import { afterEach, describe, expect, it, vi } from "vitest";
import PackageDropdownSearchList from "./PackageDropdownSearchList";

type QueryResultType = UseInfiniteQueryResult<
  InfiniteData<AxiosResponse<SearchPackagesResponse>>
> & { isError: false };

const mockDownshift = {
  highlightedIndex: -1,
  getItemProps: vi.fn(),
  getMenuProps: vi.fn(),
} as unknown as ControllerStateAndHelpers<Package>;

const mockQueryResult = {
  data: {
    pages: [
      {
        data: {
          count: packages.length,
          next: null,
          prev: null,
          packages: packages,
        },
        status: 200,
        statusText: "OK",
        headers: {},
        config: { headers: new AxiosHeaders() },
      },
    ],
    pageParams: [],
  },
  isPending: false,
  hasNextPage: false,
  isFetchingNextPage: false,
  fetchNextPage: vi.fn(),
} as unknown as QueryResultType;

const [selectedPackage] = packages;

const props = {
  downshiftOptions: mockDownshift,
  queryResult: mockQueryResult,
  selectedPackages: [selectedPackage],
  exact: false,
  search: "",
} as const satisfies ComponentProps<typeof PackageDropdownSearchList>;

describe("PackageDropdownSearchList", () => {
  it("renders list of packages when query is completed", async () => {
    renderWithProviders(<PackageDropdownSearchList {...props} />);

    for (const pkg of packages.slice(1, 10)) {
      screen.getByText(`${pkg.name} ${pkg.version}`);
    }
  });

  it("doesn't render selected packages in the dropdown", () => {
    renderWithProviders(<PackageDropdownSearchList {...props} />);

    expect(
      screen.queryByText(`${selectedPackage.name} ${selectedPackage.version}`),
    ).not.toBeInTheDocument();
  });

  it("renders nothing when exact is true and search is empty", () => {
    renderWithProviders(
      <PackageDropdownSearchList {...props} exact={true} search="" />,
    );

    expect(screen.queryByRole("list")).not.toBeInTheDocument();
  });

  it("renders bold text for searched term", () => {
    const search = packages[1].name.substring(7);

    renderWithProviders(
      <PackageDropdownSearchList {...props} search={search} />,
    );

    const searchResult = screen.getByText(search);
    expect(searchResult).toHaveRole("strong");
    expect(searchResult.closest("div")?.textContent).toEqual(
      `${packages[1].name} ${packages[1].version}`,
    );
  });

  it("renders empty message for exact search", async () => {
    props.queryResult.data = {
      pages: [],
      pageParams: [],
    };

    renderWithProviders(
      <PackageDropdownSearchList
        {...props}
        exact={true}
        search="nonexistentpackage"
      />,
    );

    const errorText = await screen.findByText(/Package not found/i);
    expect(errorText).toBeInTheDocument();
  });

  it("renders empty message for non-exact search", async () => {
    props.queryResult.data = {
      pages: [],
      pageParams: [],
    };

    renderWithProviders(
      <PackageDropdownSearchList
        {...props}
        exact={false}
        search="nonexistentpackage"
      />,
    );

    const errorText = await screen.findByText(/No packages found/i);
    expect(errorText).toBeInTheDocument();
  });

  it("renders loading when query is pending", () => {
    const queryResultPending = {
      ...mockQueryResult,
      isPending: true,
    } as QueryResultType;

    renderWithProviders(
      <PackageDropdownSearchList {...props} queryResult={queryResultPending} />,
    );
    expect(screen.getByRole("status")).toBeInTheDocument();
  });
  describe("pagination", () => {
    let restoreIntersectionObserver: (() => void) | undefined;

    afterEach(() => {
      restoreIntersectionObserver?.();
      restoreIntersectionObserver = undefined;
    });

    const createPage = (
      pagePackages: SearchPackagesResponse["packages"],
    ): AxiosResponse<SearchPackagesResponse> => ({
      data: {
        count: packages.length,
        next: null,
        prev: null,
        packages: pagePackages,
      },
      status: 200,
      statusText: "OK",
      headers: {},
      config: { headers: new AxiosHeaders() },
    });

    const createQueryResult = (
      pageCount: number,
      overrides: Partial<QueryResultType>,
    ) =>
      ({
        ...mockQueryResult,
        data: {
          pages: Array.from({ length: pageCount }, (_, index) =>
            createPage(packages.slice(index * 2, index * 2 + 2)),
          ),
          pageParams: [],
        },
        ...overrides,
      }) as unknown as QueryResultType;

    it("fetches successive pages while the loading footer stays visible", () => {
      restoreIntersectionObserver = mockIntersectionObserver({
        isIntersecting: true,
      });

      const fetchNextPage = vi.fn();

      const { rerender } = renderWithProviders(
        <PackageDropdownSearchList
          {...props}
          selectedPackages={[]}
          queryResult={createQueryResult(1, {
            hasNextPage: true,
            fetchNextPage,
          })}
        />,
      );

      expect(fetchNextPage).toHaveBeenCalledTimes(1);

      rerender(
        <PackageDropdownSearchList
          {...props}
          selectedPackages={[]}
          queryResult={createQueryResult(1, {
            hasNextPage: true,
            isFetchingNextPage: true,
            fetchNextPage,
          })}
        />,
      );

      // No duplicate request while the next page is in flight.
      expect(fetchNextPage).toHaveBeenCalledTimes(1);

      rerender(
        <PackageDropdownSearchList
          {...props}
          selectedPackages={[]}
          queryResult={createQueryResult(2, {
            hasNextPage: true,
            fetchNextPage,
          })}
        />,
      );

      // The footer never left the viewport, but the next page is requested.
      expect(fetchNextPage).toHaveBeenCalledTimes(2);

      rerender(
        <PackageDropdownSearchList
          {...props}
          selectedPackages={[]}
          queryResult={createQueryResult(3, {
            hasNextPage: false,
            fetchNextPage,
          })}
        />,
      );

      expect(fetchNextPage).toHaveBeenCalledTimes(2);
      expect(screen.queryByRole("status")).not.toBeInTheDocument();
    });
  });
});
