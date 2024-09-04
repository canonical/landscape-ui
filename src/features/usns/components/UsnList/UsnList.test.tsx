import { ComponentProps } from "react";
import { describe, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { instances } from "@/tests/mocks/instance";
import { usns } from "@/tests/mocks/usn";
import { renderWithProviders } from "@/tests/render";
import UsnList from "./UsnList";

const mockedUsns = usns.slice(0, 5);
const onSelectedUsnsChange = vi.fn();
const onNextPageFetch = vi.fn();
const totalUsnCount = 15;

const expandableProps: ComponentProps<typeof UsnList> = {
  instances,
  isUsnsLoading: false,
  onSelectedUsnsChange,
  selectedUsns: [],
  tableType: "expandable",
  totalUsnCount,
  usns: mockedUsns,
  onNextPageFetch,
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

    expect(onSelectedUsnsChange).toBeCalledWith(
      mockedUsns.map((usn) => usn.usn),
    );

    await userEvent.click(screen.getByText(`Toggle ${usns[0].usn}`));

    expect(onSelectedUsnsChange).toBeCalledWith([usns[0].usn]);
  });

  it("should expand and collapse packages list", async () => {
    renderWithProviders(<UsnList {...expandableProps} />);

    await userEvent.click(screen.getAllByText(/show packages/i)[0]);

    expect(screen.getByText(/hide packages/i)).toBeInTheDocument();
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
});
