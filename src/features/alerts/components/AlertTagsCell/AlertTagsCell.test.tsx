import { alerts } from "@/tests/mocks/alerts";
import { renderWithProviders } from "@/tests/render";
import { setEndpointStatus } from "@/tests/controllers/controller";
import type { MultiSelectItem } from "@canonical/react-components";
import { screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { beforeEach, describe, expect, it } from "vitest";
import AlertTagsCell from "./AlertTagsCell";

const [mockAlert] = alerts;
assert(mockAlert);
const nonAllAlert = alerts.find((alert) => !alert.all_computers);
assert(nonAllAlert);
const taggedNonAllAlert = {
  ...nonAllAlert,
  tags: ["tag1", "tag2"],
};

const mockAvailableTagOptions: MultiSelectItem[] = [
  { value: "All", label: "All instances" },
  { value: "tag1", label: "Tag 1", group: "Tags" },
  { value: "tag2", label: "Tag 2", group: "Tags" },
  { value: "tag3", label: "Tag 3", group: "Tags" },
];

describe("AlertTagsCell", () => {
  beforeEach(() => {
    setEndpointStatus("default");
  });

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

  it("saves all-instances selection and shows success message", async () => {
    const user = userEvent.setup();

    renderWithProviders(
      <AlertTagsCell
        alert={mockAlert}
        availableTagOptions={mockAvailableTagOptions}
      />,
    );

    await user.click(screen.getByRole("combobox"));
    await user.click(screen.getByRole("checkbox", { name: "All instances" }));
    await user.click(screen.getByRole("button", { name: "Save changes" }));

    expect(await screen.findByText("Alert tags updated")).toBeInTheDocument();
  });

  it("saves deselected all-instances tags and shows success message", async () => {
    const user = userEvent.setup();

    renderWithProviders(
      <AlertTagsCell
        alert={mockAlert}
        availableTagOptions={mockAvailableTagOptions}
      />,
    );

    await user.click(screen.getByRole("combobox"));
    await user.click(screen.getByRole("checkbox", { name: "All instances" }));
    await user.click(screen.getByRole("checkbox", { name: "Tag 2" }));
    await user.click(screen.getByRole("button", { name: "Save changes" }));

    expect(await screen.findByText("Alert tags updated")).toBeInTheDocument();
  });

  it("saves tag additions/removals for non-all alert and shows success message", async () => {
    const user = userEvent.setup();

    renderWithProviders(
      <AlertTagsCell
        alert={nonAllAlert}
        availableTagOptions={mockAvailableTagOptions}
      />,
    );

    await user.click(screen.getByRole("combobox"));
    await user.click(screen.getByRole("checkbox", { name: "Tag 1" }));
    await user.click(screen.getByRole("button", { name: "Save changes" }));

    expect(await screen.findByText("Alert tags updated")).toBeInTheDocument();
  });

  it("saves all-instances selection for non-all alerts", async () => {
    const user = userEvent.setup();

    renderWithProviders(
      <AlertTagsCell
        alert={nonAllAlert}
        availableTagOptions={mockAvailableTagOptions}
      />,
    );

    await user.click(screen.getByRole("combobox"));
    await user.click(screen.getByRole("checkbox", { name: "All instances" }));
    await user.click(screen.getByRole("button", { name: "Save changes" }));

    expect(await screen.findByText("Alert tags updated")).toBeInTheDocument();
  });

  it("saves deselected tags for non-all alerts with preselected tags", async () => {
    const user = userEvent.setup();

    renderWithProviders(
      <AlertTagsCell
        alert={taggedNonAllAlert}
        availableTagOptions={mockAvailableTagOptions}
      />,
    );

    await user.click(screen.getByRole("combobox"));
    await user.click(screen.getByRole("checkbox", { name: "Tag 2" }));
    await user.click(screen.getByRole("button", { name: "Save changes" }));

    expect(await screen.findByText("Alert tags updated")).toBeInTheDocument();
  });

  it("shows an error notification when saving tags fails", async () => {
    const user = userEvent.setup();
    setEndpointStatus({ status: "error", path: "AssociateAlert" });

    renderWithProviders(
      <AlertTagsCell
        alert={nonAllAlert}
        availableTagOptions={mockAvailableTagOptions}
      />,
    );

    await user.click(screen.getByRole("combobox"));
    await user.click(screen.getByRole("checkbox", { name: "Tag 1" }));
    await user.click(screen.getByRole("button", { name: "Save changes" }));
    expect(
      await screen.findByText('The endpoint status is set to "error".'),
    ).toBeInTheDocument();
  });
});
