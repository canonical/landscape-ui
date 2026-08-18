import { instances } from "@/tests/mocks/instance";
import { usns } from "@/tests/mocks/usn";
import { renderWithProviders } from "@/tests/render";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import type { ComponentProps } from "react";
import { describe, expect, vi, assert } from "vitest";
import UsnList from "./UsnList";
import { NO_DATA_TEXT } from "@/components/layout/NoData/constants";

const mockedUsns = usns.slice(0, 5);
const onNextPageFetch = vi.fn();
const onSelectedUsnsChange = vi.fn();
const onSelectAllClick = vi.fn();
const totalUsnCount = 15;

const expandableProps: ComponentProps<typeof UsnList> = {
  instances,
  isUsnsLoading: false,
  onNextPageFetch,
  onSelectAllClick,
  onSelectedUsnsChange,
  selectedUsns: [],
  showSelectAllButton: false,
  tableType: "expandable",
  totalSelectedUsnCount: 0,
  totalUsnCount,
  usns: mockedUsns,
};

const paginatedProps: ComponentProps<typeof UsnList> = {
  ...expandableProps,
  search: "",
  tableType: "paginated",
  totalUsnCount: 95,
};

describe("UsnList", () => {
  it("should render expandable list", async () => {
    render(<UsnList {...expandableProps} />);

    expect(
      screen.queryByRole("columnheader", { name: /date published/i }),
    ).not.toBeInTheDocument();
    expect(
      screen.getByRole("columnheader", { name: /affected instances/i }),
    ).toBeInTheDocument();

    expect(
      screen.getByText(`Showing 5 of ${totalUsnCount} security issues.`),
    ).toBeInTheDocument();
    expect(screen.getByText(usns[0].usn)).toBeInTheDocument();

    const cveLink = screen
      .getByText(usns[0].cves[0].cve)
      .closest("a") as HTMLAnchorElement;
    expect(cveLink).toHaveAttribute("href", usns[0].cves[0].cve_link);

    expect(screen.getAllByRole("rowheader").length).toEqual(5);

    await userEvent.click(screen.getByText(/show 5 more/i));

    expect(onNextPageFetch).toHaveBeenCalledOnce();

    await userEvent.click(screen.getByText(/toggle all security issues/i));

    expect(onSelectedUsnsChange).toHaveBeenCalledWith(
      mockedUsns.map((usn) => usn.usn),
    );

    await userEvent.click(screen.getByText(`Toggle ${usns[0].usn}`));

    expect(onSelectedUsnsChange).toHaveBeenCalledWith([usns[0].usn]);
  });

  it("should render NoData when a USN has no CVEs", () => {
    const usnWithNoCves = usns.find((u) => u.cves.length === 0);
    assert(usnWithNoCves, "Expected a USN with no CVEs in mock data");

    render(
      <UsnList {...expandableProps} usns={[usnWithNoCves]} totalUsnCount={1} />,
    );

    expect(screen.getByText(NO_DATA_TEXT)).toBeInTheDocument();
  });

  it("should deselect a USN when it is already selected", async () => {
    const [firstMockedUsn] = mockedUsns;
    assert(firstMockedUsn);
    render(
      <UsnList {...expandableProps} selectedUsns={[firstMockedUsn.usn]} />,
    );

    await userEvent.click(screen.getByText(`Toggle ${usns[0].usn}`));

    expect(onSelectedUsnsChange).toHaveBeenCalledWith([]);
  });

  it("should deselect all when some are selected and toggle-all is clicked", async () => {
    const [firstMockedUsn] = mockedUsns;
    assert(firstMockedUsn);
    render(
      <UsnList {...expandableProps} selectedUsns={[firstMockedUsn.usn]} />,
    );

    await userEvent.click(screen.getByText(/toggle all security issues/i));

    expect(onSelectedUsnsChange).toHaveBeenCalledWith([]);
  });

  it("should expand and collapse packages list", async () => {
    renderWithProviders(<UsnList {...expandableProps} />);

    const [button] = screen.getAllByText(/show packages/i);
    assert(button);
    await userEvent.click(button);

    expect(screen.getByText(/hide packages/i)).toBeInTheDocument();

    await userEvent.click(screen.getByText(/hide packages/i));
    expect(screen.getAllByText(/show packages/i).length).toBeGreaterThan(0);
  });

  it("should keep the packages row expansion open when pressing Escape", async () => {
    renderWithProviders(<UsnList {...expandableProps} />);

    const [button] = screen.getAllByText(/show packages/i);
    assert(button);
    await userEvent.click(button);

    expect(screen.getByText(/hide packages/i)).toBeInTheDocument();

    await userEvent.keyboard("{Escape}");

    expect(screen.getByText(/hide packages/i)).toBeInTheDocument();
  });

  it("should expand and collapse affected instances when clicking computers count button", async () => {
    renderWithProviders(<UsnList {...expandableProps} />);

    const [initialButton] = screen.getAllByRole("button", { name: /^\d+$/ });
    assert(initialButton);
    await userEvent.click(initialButton);

    const [expandedButton] = screen.getAllByRole("button", { name: /^\d+$/ });
    assert(expandedButton);
    expect(expandedButton).toHaveAttribute("aria-expanded", "true");
    expect(screen.getByText(/Instances affected by/i)).toBeInTheDocument();

    await userEvent.click(expandedButton);
    const [collapsedButton] = screen.getAllByRole("button", { name: /^\d+$/ });
    assert(collapsedButton);
    expect(collapsedButton).toHaveAttribute("aria-expanded", "false");
    expect(
      screen.queryByText(/Instances affected by/i),
    ).not.toBeInTheDocument();
  });

  it("should render loading state row when isUsnsLoading is true", () => {
    render(<UsnList {...expandableProps} isUsnsLoading usns={mockedUsns} />);

    expect(screen.getByRole("status")).toBeInTheDocument();
  });

  it("should render 'select all' button", async () => {
    renderWithProviders(
      <UsnList
        {...expandableProps}
        selectedUsns={mockedUsns.map((usn) => usn.usn)}
        showSelectAllButton
        totalSelectedUsnCount={totalUsnCount - 1}
      />,
    );

    expect(screen.getByLabelText("Toggle all security issues")).toBeChecked();

    expect(
      screen.getByText(
        `Selected ${totalUsnCount - 1} security issues currently.`,
      ),
    ).toBeInTheDocument();

    await userEvent.click(
      screen.getByText(`Select all ${totalUsnCount} security issues.`),
    );

    expect(onSelectAllClick).toHaveBeenCalledOnce();
  });

  it("should render paginated list", () => {
    renderWithProviders(<UsnList {...paginatedProps} />);

    expect(
      screen.getByRole("columnheader", { name: /date published/i }),
    ).toBeInTheDocument();
    expect(
      screen.queryByRole("columnheader", { name: /affected instances/i }),
    ).not.toBeInTheDocument();
    expect(
      screen.getByRole("navigation", { name: /table pagination/i }),
    ).toBeInTheDocument();
  });

  it("should show empty message when search returns no results for paginated list", () => {
    renderWithProviders(
      <UsnList {...paginatedProps} usns={[]} search="no-results" />,
    );

    expect(
      screen.getByText(/no security issues found with the search/i),
    ).toBeInTheDocument();
  });

  it("should expand CVEs and collapse on outside click", async () => {
    renderWithProviders(<UsnList {...expandableProps} />);

    const showMoreButtons = screen.queryAllByRole("button", {
      name: /show more/i,
    });

    const [showMoreButton] = showMoreButtons;
    assert(showMoreButton);
    await userEvent.click(showMoreButton);

    const showMoreButtonsExpanded = screen.queryAllByRole("button", {
      name: /show more/i,
    });
    expect(showMoreButtonsExpanded).toHaveLength(showMoreButtons.length - 1);

    const outsideElement = screen.getByText("CVE(s)");
    await userEvent.click(outsideElement);

    const showMoreButtonsClosed = screen.queryAllByRole("button", {
      name: /show more/i,
    });
    expect(showMoreButtonsClosed).toHaveLength(showMoreButtons.length);
  });

  it("should trigger CVE expand and collapse on escape", async () => {
    renderWithProviders(<UsnList {...expandableProps} />);

    const showMoreButtons = screen.queryAllByRole("button", {
      name: /show more/i,
    });

    const [showMoreButton] = showMoreButtons;
    assert(showMoreButton);
    await userEvent.click(showMoreButton);

    await userEvent.keyboard("{Escape}");

    const showMoreButtonsClosed = screen.queryAllByRole("button", {
      name: /show more/i,
    });
    expect(showMoreButtonsClosed).toHaveLength(showMoreButtons.length);
  });

  it("should clear selection when paginating", async () => {
    const [firstMockedUsn] = mockedUsns;
    assert(firstMockedUsn);
    renderWithProviders(
      <UsnList {...paginatedProps} selectedUsns={[firstMockedUsn.usn]} />,
    );

    const nextPageButton = screen.getByRole("button", { name: /next page/i });
    await userEvent.click(nextPageButton);

    expect(onSelectedUsnsChange).toHaveBeenCalledWith([]);
  });
});
