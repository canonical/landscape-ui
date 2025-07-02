import { renderWithProviders } from "@/tests/render";
import { screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it } from "vitest";
import SidePanel from "./SidePanel";

describe("SidePanel", () => {
  it("should render", async () => {
    renderWithProviders(
      <SidePanel expanded onClose={() => undefined} size="small" title="Title">
        Children
      </SidePanel>,
    );

    expect(screen.getByText("Title")).toBeInTheDocument();
    expect(screen.getByText("Children")).toBeInTheDocument();
  });

  it("should close", async () => {
    const handleClose = vi.fn();

    renderWithProviders(
      <SidePanel
        closeButtonAriaLabel="Close form"
        expanded
        onClose={handleClose}
        size="small"
        title="Title"
      >
        Children
      </SidePanel>,
    );

    await userEvent.click(screen.getByRole("button", { name: "Close form" }));

    expect(handleClose).toHaveBeenCalledOnce();
  });
});
