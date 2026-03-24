import { renderWithProviders } from "@/tests/render";
import { screen } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import HeaderActions from "./HeaderActions";
import type { Action } from "@/types/Action";

const nondestructiveActions: Action[] = [
  { icon: "edit", label: "Edit", onClick: vi.fn() },
  { icon: "copy", label: "Copy", onClick: vi.fn() },
];

describe("HeaderActions", () => {
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
});
