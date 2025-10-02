import { expectLoadingState } from "@/tests/helpers";
import { accessGroups } from "@/tests/mocks/accessGroup";
import { removalProfiles } from "@/tests/mocks/removalProfiles";
import { renderWithProviders } from "@/tests/render";
import { screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import RemovalProfileDetailsSidePanel from "./RemovalProfileDetailsSidePanel";

const [profile] = removalProfiles;
const accessGroupOptions = accessGroups.map((group) => ({
  label: group.title,
  value: group.name,
}));

describe("RemovalProfileDetails", () => {
  it("renders all info items correctly", async () => {
    const { container } = renderWithProviders(
      <RemovalProfileDetailsSidePanel />,
      undefined,
      `/?profile=${profile.id}`,
    );

    await expectLoadingState();

    const accessGroup =
      accessGroupOptions.find((option) => option.value === profile.access_group)
        ?.label ?? profile.access_group;

    const fields = [
      { label: "Title", value: profile.title },
      { label: "Access group", value: accessGroup },
      {
        label: "Removal timeframe",
        value: `${profile.days_without_exchange} days`,
      },
    ];

    fields.forEach((field) => {
      expect(container).toHaveInfoItem(field.label, field.value);
    });
  });

  it("renders Edit and Remove buttons with correct aria-labels", async () => {
    renderWithProviders(
      <RemovalProfileDetailsSidePanel />,
      undefined,
      `/?profile=${profile.id}`,
    );

    await expectLoadingState();

    const editButton = screen.getByRole("button", {
      name: `Edit ${profile.title}`,
    });
    const removeButton = screen.getByRole("button", {
      name: `Remove ${profile.title}`,
    });

    expect(editButton).toBeInTheDocument();
    expect(removeButton).toBeInTheDocument();
  });
});
