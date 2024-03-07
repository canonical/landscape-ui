import { describe, expect, vi } from "vitest";
import UsnList from "./UsnList";
import { act, fireEvent, render, screen } from "@testing-library/react";
import { renderWithProviders } from "@/tests/render";
import { usns } from "@/tests/mocks/usn";
import { instances } from "@/tests/mocks/instance";

const commonProps = {
  usns,
  instanceIds: [1],
  isUsnsLoading: false,
};

const expandableProps = {
  ...commonProps,
  tableType: "expandable" as "expandable",
};

const paginatedProps = {
  ...commonProps,
  instance: instances[0],
  tableType: "paginated" as "paginated",
  search: "",
  selectedUsns: [],
  onSelectedUsnsChange: vi.fn(),
};

describe("UsnList", () => {
  it("should render list", () => {
    render(<UsnList {...expandableProps} usns={[usns[0]]} />);

    expect(screen.getByText("Security issues")).toBeInTheDocument();
    expect(
      screen.getByText("Showing 1 of 1 security issue."),
    ).toBeInTheDocument();
    expect(screen.getByText(usns[0].usn)).toBeInTheDocument();

    const cveLink = screen
      .getByText(usns[0].cves[0].cve)
      .closest("a") as HTMLAnchorElement;
    expect(cveLink).toHaveAttribute("href", usns[0].cves[0].cve_link);
  });

  it("should expand and collapse packages list", async () => {
    renderWithProviders(<UsnList {...expandableProps} usns={[usns[0]]} />);

    act(() => {
      fireEvent.click(screen.getByText(/show packages/i));
    });

    expect(screen.getByText(/hide packages/i)).toBeInTheDocument();
  });

  it("should render expandable list", async () => {
    render(<UsnList {...expandableProps} />);

    expect(screen.getByText("Security issues")).toBeInTheDocument();

    await act(() => {
      fireEvent.click(screen.getByText(/show 5 more/i));
    });
  });

  it("should render paginated list", () => {
    render(<UsnList {...paginatedProps} />);

    expect(screen.getByText(/toggle all security issues/i)).toBeOffScreen();
  });
});
