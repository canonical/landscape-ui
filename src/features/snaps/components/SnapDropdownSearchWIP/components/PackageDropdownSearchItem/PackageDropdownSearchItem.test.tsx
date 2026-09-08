import { renderWithProviders } from "@/tests/render";
import { screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import PackageDropdownSearchItem from "./PackageDropdownSearchItem";
import { ICONS } from "@canonical/react-components";
import userEvent from "@testing-library/user-event";
import type { ComponentProps } from "react";

const props: ComponentProps<typeof PackageDropdownSearchItem> = {
  selectedPackage: {
    name: "libthai0",
    id: 15,
    computers: {
      count: 4,
    },
    summary: "Thai language support library",
    version: "0.1.28-1",
  },
  onDelete: vi.fn(),
};

describe("PackageDropdownSearchItem", () => {
  const user = userEvent.setup();

  it("renders package with delete button", async () => {
    renderWithProviders(<PackageDropdownSearchItem {...props} />);

    expect(screen.getByRole("button")).toHaveIcon(ICONS.delete);
  });

  it("deletes package when delete button is clicked", async () => {
    renderWithProviders(<PackageDropdownSearchItem {...props} />);

    const deleteButton = screen.getByRole("button");
    await user.click(deleteButton);
    expect(props.onDelete).toHaveBeenCalled();
  });
});
