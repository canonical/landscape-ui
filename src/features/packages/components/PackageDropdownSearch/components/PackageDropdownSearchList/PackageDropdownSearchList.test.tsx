import { renderWithProviders } from "@/tests/render";
import { screen } from "@testing-library/react";
import { describe, expect, it, type Mock } from "vitest";
import { packages } from "@/tests/mocks/packages";
import PackageDropdownSearchList from "./PackageDropdownSearchList";
import { AxiosHeaders, AxiosResponse } from "axios";
import classes from "./PackageDropdownSearchList.module.scss";

const mockDownshift = {
  highlightedIndex: -1,
  getItemProps: vi.fn(),
} as any;

const mockQueryResult = {
  data: {
    pages: [{
      data: {
        count: packages.length,
        next: null,
        previous: null,
        results: packages,
      },
      status: 200,
      statusText: "OK",
      headers: {},
      config: { headers: new AxiosHeaders() },
    }],
    pageParams: [],
  },
  isPending: false,
  hasNextPage: false,
  isFetchingNextPage: false,
  fetchNextPage: vi.fn(),
}

const selectedPackage = {
  name: "accountsservice",
  id: 174788,
  versions: ["0.6.55-0ubuntu12~20.04.6"],
}

const props = {
  downshiftOptions: mockDownshift,
  queryResult: mockQueryResult as any,
  selectedPackages: [selectedPackage],
  hasOneInstance: false,
  exact: false,
  search: "",
}

describe("PackageDropdownSearchList", () => {
  it("renders list of packages when query is completed", () => {
    renderWithProviders(
      <PackageDropdownSearchList
        {...props}
      />,
    );

    packages.map(({ name }) => {
      screen.getByText(name);
    });
  });

  it("renders selected packages disabled in dropdown", () => {
    renderWithProviders(
      <PackageDropdownSearchList
        {...props}
      />,
    );

    const listItem = screen.getByText(selectedPackage.name).closest("li");
    expect(listItem).toHaveClass(classes.disabled);
  });

  it("renders nothing when exact is true and search is empty", () => {
    renderWithProviders(
      <PackageDropdownSearchList
        {...props}
        exact={true}
        search=""
      />
    );

    expect(screen.queryByRole("list")).not.toBeInTheDocument();
  });

  it("renders bold text for searched term", () => {
    const search = selectedPackage.name.substring(7);

    renderWithProviders(
      <PackageDropdownSearchList
        {...props}
        search={search}
      />,
    );

    const searchResult = screen.getByText(search);
    expect(searchResult).toHaveStyle("font-weight: bolder;");
    expect(searchResult.closest("div")?.textContent).toEqual(selectedPackage.name);
  });

  it("renders specific version for 1 instance with 1 version", () => {
    renderWithProviders(
      <PackageDropdownSearchList
        {...props}
        hasOneInstance={true}
      />,
    );

    const { name, versions } = selectedPackage;
    screen.getByText(name);
    screen.getByText(versions[0] ?? "");
  });

  it("renders empty message for exact search", async () => {
    props.queryResult.data.pages = [];

    renderWithProviders(
      <PackageDropdownSearchList
        {...props}
        exact={true}
        search="nonexistentpackage"
      />,
    );

    const errorText = await screen.findByText(
      /Package not found/i,
    );
    expect(errorText).toBeInTheDocument();
  });

  it("renders empty message for non-exact search", async () => {
    props.queryResult.data.pages = [];

    renderWithProviders(
      <PackageDropdownSearchList
        {...props}
        exact={false}
        search="nonexistentpackage"
      />,
    );

    const errorText = await screen.findByText(
      /No packages found/i,
    );
    expect(errorText).toBeInTheDocument();
  });

  it("renders loading when query is pending", () => {
    const queryResultPending = {
      ...mockQueryResult,
      isPending: true,
    } as any;

    renderWithProviders(
      <PackageDropdownSearchList {...props} queryResult={queryResultPending} />
    );
    expect(screen.getByRole("status")).toBeInTheDocument();
  });
})
