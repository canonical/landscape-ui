import { renderWithProviders } from "@/tests/render";
import { screen, within } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import userEvent from "@testing-library/user-event";

import ConsentBannerModal from "./ConsentBannerModal";

describe("ConsentBannerModal", () => {
  const mockProceed = vi.fn();

  it("renders properly", () => {
    renderWithProviders(<ConsentBannerModal onClose={mockProceed} />);

    expect(
      screen.getByRole("heading", {
        name: /proceed after acknowledging consent/i,
      }),
    ).toBeInTheDocument();

    expect(
      screen.getByRole("checkbox", {
        name: /i acknowledge that i have read and understood the above consent notice\./i,
      }),
    ).toBeInTheDocument();
  });

  it("checkbox is clickable", async () => {
    const user = userEvent.setup();
    renderWithProviders(<ConsentBannerModal onClose={mockProceed} />);

    const checkbox = screen.getByRole("checkbox", {
      name: /i acknowledge/i,
    });

    expect(checkbox).not.toBeChecked();

    await user.click(checkbox);
    expect(checkbox).toBeChecked();
  });

  it("proceed button is disabled until the checkbox is clicked", async () => {
    const user = userEvent.setup();
    renderWithProviders(<ConsentBannerModal onClose={mockProceed} />);

    const dialog = await screen.findByRole("dialog", {
      name: /proceed after acknowledging consent/i,
    });
    const proceedButton = within(dialog).getByRole("button", {
      name: /^proceed$/i,
    });
    const checkbox = screen.getByRole("checkbox", { name: /i acknowledge/i });

    expect(proceedButton).toHaveAttribute("aria-disabled", "true");

    await user.click(checkbox);

    expect(proceedButton).not.toHaveAttribute("aria-disabled", "true");
  });

  it("clicking proceed closes the modal", async () => {
    const user = userEvent.setup();
    renderWithProviders(<ConsentBannerModal onClose={mockProceed} />);

    const checkbox = screen.getByRole("checkbox", { name: /i acknowledge/i });
    const proceedButton = screen.getByRole("button", { name: /proceed/i });

    await user.click(checkbox);
    await user.click(proceedButton);

    expect(mockProceed).toHaveBeenCalledTimes(1);
  });
});
