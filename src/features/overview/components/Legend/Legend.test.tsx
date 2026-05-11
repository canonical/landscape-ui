import { renderWithProviders } from "@/tests/render";
import { fireEvent, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import Legend from "./Legend";

describe("Legend", () => {
  const mockOnArcEnter = vi.fn();
  const mockOnArcLeave = vi.fn();

  const items = [
    { label: "Up to date", count: 6 },
    { label: "Regular", count: 7 },
    { label: "Security", count: 5 },
  ];

  const props = {
    items,
    selectedArc: null,
    onArcEnter: mockOnArcEnter,
    onArcLeave: mockOnArcLeave,
  };

  beforeEach(() => {
    mockOnArcEnter.mockClear();
    mockOnArcLeave.mockClear();
  });

  it("renders without crashing", () => {
    renderWithProviders(<Legend {...props} />);
  });

  it("renders a row for each item label", () => {
    renderWithProviders(<Legend {...props} />);

    items.forEach((item) => {
      expect(screen.getByText(item.label)).toBeInTheDocument();
    });
  });

  it("renders a link with the count for each item", () => {
    renderWithProviders(<Legend {...props} />);

    items.forEach((item) => {
      expect(
        screen.getByRole("link", { name: `${item.count} instances` }),
      ).toBeInTheDocument();
    });
  });

  it("renders zero counts as plain text rather than a link", () => {
    renderWithProviders(
      <Legend
        {...props}
        items={[
          { label: "Up to date", count: 6 },
          { label: "Regular", count: 0 },
        ]}
      />,
    );

    expect(
      screen.queryByRole("link", { name: "0 instances" }),
    ).not.toBeInTheDocument();
    expect(screen.getByText("0 instances")).toBeInTheDocument();
    expect(
      screen.getByRole("link", { name: "6 instances" }),
    ).toBeInTheDocument();
  });

  it("calls onArcEnter with the index when an item is hovered", async () => {
    renderWithProviders(<Legend {...props} />);

    await userEvent.hover(screen.getByText("Up to date"));

    expect(mockOnArcEnter).toHaveBeenCalledWith(0);
  });

  it("calls onArcEnter when an item receives focus", () => {
    renderWithProviders(<Legend {...props} />);

    const row = screen.getByText("Regular").closest("div")?.parentElement;
    expect(row).not.toBeNull();
    fireEvent.focus(row as HTMLElement);

    expect(mockOnArcEnter).toHaveBeenCalledWith(1);
  });

  it("calls onArcLeave when the legend container loses pointer", () => {
    const { container } = renderWithProviders(<Legend {...props} />);

    const legendContainer = container.querySelector("div");
    expect(legendContainer).not.toBeNull();
    fireEvent.mouseLeave(legendContainer as HTMLElement);

    expect(mockOnArcLeave).toHaveBeenCalled();
  });

  it("dims rows that are not the selected arc", () => {
    const { container } = renderWithProviders(
      <Legend {...props} selectedArc={0} />,
    );

    const rows = container.querySelectorAll("[style]");
    expect(rows[0]).toHaveStyle({ opacity: "1" });
    expect(rows[1]).toHaveStyle({ opacity: "0.55" });
    expect(rows[2]).toHaveStyle({ opacity: "0.55" });
  });

  it("marks the selected row with aria-current and an active class", () => {
    const { container } = renderWithProviders(
      <Legend {...props} selectedArc={1} />,
    );

    const rows = container.querySelectorAll("[style]");
    expect(rows[0]).not.toHaveAttribute("aria-current");
    expect(rows[1]).toHaveAttribute("aria-current", "true");
    expect(rows[1]?.getAttribute("class") ?? "").toMatch(/legendItem--active/);
  });

  it("renders all rows at full opacity when selectedArc is null", () => {
    const { container } = renderWithProviders(<Legend {...props} />);

    const rows = container.querySelectorAll("[style]");
    rows.forEach((row) => {
      expect(row).toHaveStyle({ opacity: "1" });
    });
  });

  it("renders nothing when items is empty", () => {
    renderWithProviders(<Legend {...props} items={[]} />);
    items.forEach((item) => {
      expect(screen.queryByText(item.label)).not.toBeInTheDocument();
    });
    expect(screen.queryByRole("link")).not.toBeInTheDocument();
  });

  it("falls back to the Unknown status icon when a label is unrecognised", () => {
    const { container } = renderWithProviders(
      <Legend {...props} items={[{ label: "Mystery label", count: 1 }]} />,
    );

    expect(screen.getByText("Mystery label")).toBeInTheDocument();
    expect(
      container.querySelector("i.p-icon--package-profiles-alert"),
    ).toBeInTheDocument();
  });
});
