import { renderWithProviders } from "@/tests/render";
import { screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import PackageSearchDowngradeItem from "./PackageSearchDowngradeItem";
import { ICONS } from "@canonical/react-components";
import userEvent from "@testing-library/user-event";
import type { ComponentProps } from "react";

const props = {
  selectedPackage: [
    {
      name: "libthai0",
      id: 15,
      version: "0.1.28-1",
      computers: {
        count: 4,
      },
      summary: "Thai language support library",
    },
    [],
  ],
  onDelete: vi.fn(),
  onItemsUpdate: vi.fn(),
  instanceIds: [1, 2, 3, 4],
} as const satisfies ComponentProps<typeof PackageSearchDowngradeItem>;

window.HTMLElement.prototype.scrollIntoView = vi.fn();

describe("PackageSearchDowngradeItem", () => {
  const user = userEvent.setup();

  it("renders package with delete button and all versions", async () => {
    renderWithProviders(<PackageSearchDowngradeItem {...props} />);

    expect(
      screen.getByRole("button", {
        name: `Delete ${props.selectedPackage[0].name}`,
      }),
    ).toHaveIcon(ICONS.delete);
  });

  it("deletes package when delete button is clicked", async () => {
    renderWithProviders(<PackageSearchDowngradeItem {...props} />);

    const deleteButton = screen.getByRole("button", {
      name: `Delete ${props.selectedPackage[0].name}`,
    });
    await user.click(deleteButton);
    expect(props.onDelete).toHaveBeenCalled();
  });
});
