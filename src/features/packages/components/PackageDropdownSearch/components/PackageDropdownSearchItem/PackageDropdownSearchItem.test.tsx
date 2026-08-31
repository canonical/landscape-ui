import { renderWithProviders } from "@/tests/render";
import { screen, waitFor } from "@testing-library/react";
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

  it("renders package with delete button and all versions", async () => {
    renderWithProviders(<PackageDropdownSearchItem {...props} />);

    await screen.findByLabelText("Unhold as not installed on 1 instance");

    const [title, ...checkboxes] = await screen.findAllByRole("checkbox");
    await waitFor(() => {
      expect(checkboxes).toHaveLength(5);
    });

    expect(title).toHaveAccessibleName(props.selectedPackage.name);
    expect(title).not.toBeChecked();
    expect(screen.getByRole("button")).toHaveIcon(ICONS.delete);

    for (const checkbox of checkboxes) {
      expect(checkbox).not.toBeChecked();
    }

    await screen.findByText("4 instances don't have this package held");
  });

  it("deletes package when delete button is clicked", async () => {
    renderWithProviders(<PackageDropdownSearchItem {...props} />);

    const deleteButton = screen.getByRole("button");
    await user.click(deleteButton);
    expect(props.onDelete).toHaveBeenCalled();
  });
});
