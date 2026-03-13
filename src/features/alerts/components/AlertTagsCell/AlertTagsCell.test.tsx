import { alerts } from "@/tests/mocks/alerts";
import { renderWithProviders } from "@/tests/render";
import type { MultiSelectItem } from "@canonical/react-components";
import { screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it } from "vitest";
import AlertTagsCell from "./AlertTagsCell";

const mockAlert = alerts[0];

const mockAvailableTagOptions: MultiSelectItem[] = [
  { value: "All", label: "All instances" },
  { value: "tag1", label: "Tag 1", group: "Tags" },
  { value: "tag2", label: "Tag 2", group: "Tags" },
  { value: "tag3", label: "Tag 3", group: "Tags" },
];

describe("AlertTagsCell", () => {
  it("allows selecting and deselecting tags", async () => {
    renderWithProviders(
      <AlertTagsCell
        alert={mockAlert}
        availableTagOptions={mockAvailableTagOptions}
      />,
    );

    const initialComboBoxLabel = screen.getByRole("combobox").textContent;
    await userEvent.click(screen.getByRole("combobox"));
    await userEvent.click(
      screen.getByRole("checkbox", { name: "All instances" }),
    );

    expect(screen.getByRole("combobox").textContent).not.toBe(
      initialComboBoxLabel,
    );

    const saveButton = screen.getByRole("button", { name: "Save changes" });
    expect(saveButton).not.toHaveAttribute("aria-disabled");
    expect(saveButton).toBeEnabled();
  });

  it("reverts changes when clicking the Revert button", async () => {
    renderWithProviders(
      <AlertTagsCell
        alert={mockAlert}
        availableTagOptions={mockAvailableTagOptions}
      />,
    );

    const initialComboBoxLabel = screen.getByRole("combobox").textContent;
    await userEvent.click(screen.getByRole("combobox"));
    await userEvent.click(
      screen.getByRole("checkbox", { name: "All instances" }),
    );

    expect(screen.getByRole("combobox").textContent).not.toBe(
      initialComboBoxLabel,
    );

    const revertButton = screen.getByRole("button", { name: "Revert" });
    expect(revertButton).not.toHaveAttribute("aria-disabled");
    expect(revertButton).toBeEnabled();

    await userEvent.click(screen.getByText("Revert"));
    expect(screen.getByRole("combobox").textContent).toBe(initialComboBoxLabel);
  });

  it("disables Save and Revert buttons when no changes are made", async () => {
    renderWithProviders(
      <AlertTagsCell
        alert={mockAlert}
        availableTagOptions={mockAvailableTagOptions}
      />,
    );

    await userEvent.click(screen.getByRole("combobox"));

    expect(screen.getByText("Save changes")).toHaveAttribute("aria-disabled");
    expect(screen.getByText("Revert")).toHaveAttribute("aria-disabled");
  });
});
