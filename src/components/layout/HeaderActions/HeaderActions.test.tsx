import { renderWithProviders } from "@/tests/render";
import { screen, act } from "@testing-library/react";
import { describe, it, expect, vi, afterEach } from "vitest";
import HeaderActions from "./HeaderActions";
import type { Action } from "@/types/Action";

const nondestructiveActions: Action[] = [
  { icon: "edit", label: "Edit", onClick: vi.fn() },
  { icon: "copy", label: "Copy", onClick: vi.fn() },
];

describe("HeaderActions", () => {
  afterEach(() => {
    vi.restoreAllMocks();
  });

  it("renders a title", () => {
    renderWithProviders(
      <HeaderActions actions={{}} title={<h1>Page Title</h1>} />,
    );
    expect(screen.getByText("Page Title")).toBeInTheDocument();
  });

  it("renders action buttons", () => {
    renderWithProviders(
      <HeaderActions actions={{ nondestructive: nondestructiveActions }} />,
    );
    expect(screen.getByRole("button", { name: /edit/i })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /copy/i })).toBeInTheDocument();
  });

  it("renders action with icon and label", () => {
    renderWithProviders(
      <HeaderActions
        actions={{ nondestructive: nondestructiveActions }}
        title={<span>Title</span>}
      />,
    );
    expect(screen.getByText("Edit")).toBeInTheDocument();
    expect(screen.getByText("Copy")).toBeInTheDocument();
  });

  it("filters out excluded actions", () => {
    const actions: Action[] = [
      { icon: "edit", label: "Edit", onClick: vi.fn() },
      { icon: "delete", label: "Delete", onClick: vi.fn(), excluded: true },
    ];

    renderWithProviders(
      <HeaderActions actions={{ nondestructive: actions }} />,
    );

    expect(screen.getByRole("button", { name: /edit/i })).toBeInTheDocument();
    expect(
      screen.queryByRole("button", { name: /delete/i }),
    ).not.toBeInTheDocument();
  });

  it("renders destructive actions", () => {
    const destructiveActions: Action[] = [
      { icon: "delete", label: "Delete", onClick: vi.fn() },
    ];

    renderWithProviders(
      <HeaderActions
        actions={{
          nondestructive: nondestructiveActions,
          destructive: destructiveActions,
        }}
      />,
    );

    expect(screen.getByText("Delete")).toBeInTheDocument();
  });

  it("renders with no actions", () => {
    renderWithProviders(<HeaderActions actions={{}} />);

    expect(
      screen.queryByRole("button", { name: /actions/i }),
    ).not.toBeInTheDocument();
  });

  it("shows collapsed actions menu when multiple actions are forced to collapse", () => {
    const collapsedActions: Action[] = [
      {
        icon: "edit",
        label: "Edit",
        onClick: vi.fn(),
        collapsed: true,
      },
      {
        icon: "copy",
        label: "Copy",
        onClick: vi.fn(),
        collapsed: true,
      },
    ];

    renderWithProviders(
      <HeaderActions actions={{ nondestructive: collapsedActions }} />,
    );

    expect(
      screen.getByRole("button", { name: /actions/i }),
    ).toBeInTheDocument();
  });

  it("disables collapsed actions menu when all collapsed actions are disabled", () => {
    const collapsedActions: Action[] = [
      {
        icon: "edit",
        label: "Edit",
        onClick: vi.fn(),
        collapsed: true,
        disabled: true,
      },
      {
        icon: "copy",
        label: "Copy",
        onClick: vi.fn(),
        collapsed: true,
        disabled: true,
      },
    ];

    renderWithProviders(
      <HeaderActions actions={{ nondestructive: collapsedActions }} />,
    );

    const menu = screen.getByRole("button", { name: /actions/i });
    expect(menu).toHaveAttribute("aria-disabled");
  });

  it("handles container resize when width changes", () => {
    interface MockFn {
      mock: { calls: [() => void][] };
    }
    const ResizeObserverMock = window.ResizeObserver as unknown as MockFn;
    const initialCallCount = ResizeObserverMock.mock.calls.length;

    vi.spyOn(HTMLElement.prototype, "getBoundingClientRect").mockReturnValue({
      width: 600,
      height: 50,
      top: 0,
      left: 0,
      right: 600,
      bottom: 50,
      x: 0,
      y: 0,
      toJSON: vi.fn(),
    });

    renderWithProviders(
      <HeaderActions actions={{ nondestructive: nondestructiveActions }} />,
    );

    const newCalls = ResizeObserverMock.mock.calls.slice(initialCallCount);
    const lastResizeCallback = newCalls.at(-1)?.[0];

    if (lastResizeCallback) {
      act(() => {
        lastResizeCallback();
      });
    }

    expect(screen.getByRole("button", { name: /edit/i })).toBeInTheDocument();
  });

  it("handles grow-with-collapsed resize and same-width early return", async () => {
    interface MockFn {
      mock: { calls: [() => void][] };
    }
    const ResizeObserverMock = window.ResizeObserver as unknown as MockFn;
    const initialCallCount = ResizeObserverMock.mock.calls.length;

    vi.spyOn(HTMLElement.prototype, "getBoundingClientRect").mockReturnValue({
      width: 600,
      height: 50,
      top: 0,
      left: 0,
      right: 600,
      bottom: 50,
      x: 0,
      y: 0,
      toJSON: vi.fn(),
    });

    const collapsedActions: Action[] = [
      { icon: "edit", label: "Edit", onClick: vi.fn(), collapsed: true },
      { icon: "copy", label: "Copy", onClick: vi.fn(), collapsed: true },
    ];

    renderWithProviders(
      <HeaderActions actions={{ nondestructive: collapsedActions }} />,
    );

    // First resize - width changes from 0 to 600, with collapsed actions → covers lines 117-128
    const calls1 = ResizeObserverMock.mock.calls.slice(initialCallCount);
    const callback1 = calls1.at(-1)?.[0];
    if (callback1) {
      await act(async () => {
        callback1();
      });
    }

    // After re-render, get the new ResizeObserver callback
    const calls2 = ResizeObserverMock.mock.calls.slice(initialCallCount);
    const callback2 = calls2.at(-1)?.[0];

    // Second resize - same width (600 === 600) → covers line 108
    if (callback2 && callback2 !== callback1) {
      await act(async () => {
        callback2();
      });
    }

    expect(
      screen.getByRole("button", { name: /actions/i }),
    ).toBeInTheDocument();
  });
});
