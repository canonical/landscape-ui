import { renderWithProviders } from "@/tests/render";
import { screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import RepositoryProfileFormTabs from "./RepositoryProfileFormTabs";

describe("RepositoryProfileFormTabs", () => {
  const user = userEvent.setup();

  it("renders all three tabs", () => {
    renderWithProviders(
      <RepositoryProfileFormTabs currentTab={0} onCurrentTabChange={vi.fn()} />,
    );

    expect(screen.getByRole("tab", { name: "Details" })).toBeInTheDocument();
    expect(screen.getByRole("tab", { name: "Pockets" })).toBeInTheDocument();
    expect(
      screen.getByRole("tab", { name: "APT sources" }),
    ).toBeInTheDocument();
  });

  it("marks the active tab based on currentTab prop", () => {
    renderWithProviders(
      <RepositoryProfileFormTabs currentTab={1} onCurrentTabChange={vi.fn()} />,
    );

    expect(screen.getByRole("tab", { name: "Pockets" })).toHaveAttribute(
      "aria-selected",
      "true",
    );
    expect(screen.getByRole("tab", { name: "Details" })).not.toHaveAttribute(
      "aria-selected",
      "true",
    );
    expect(
      screen.getByRole("tab", { name: "APT sources" }),
    ).not.toHaveAttribute("aria-selected", "true");
  });

  it("calls onCurrentTabChange with 0 when Details tab is clicked", async () => {
    const setTab = vi.fn();
    renderWithProviders(
      <RepositoryProfileFormTabs currentTab={1} onCurrentTabChange={setTab} />,
    );

    await user.click(screen.getByRole("tab", { name: "Details" }));
    expect(setTab).toHaveBeenCalledWith(0);
  });

  it("calls onCurrentTabChange with 1 when Pockets tab is clicked", async () => {
    const setTab = vi.fn();
    renderWithProviders(
      <RepositoryProfileFormTabs currentTab={0} onCurrentTabChange={setTab} />,
    );

    await user.click(screen.getByRole("tab", { name: "Pockets" }));
    expect(setTab).toHaveBeenCalledWith(1);
  });

  it("calls onCurrentTabChange with 2 when APT sources tab is clicked", async () => {
    const setTab = vi.fn();
    renderWithProviders(
      <RepositoryProfileFormTabs currentTab={0} onCurrentTabChange={setTab} />,
    );

    await user.click(screen.getByRole("tab", { name: "APT sources" }));
    expect(setTab).toHaveBeenCalledWith(2);
  });
});
