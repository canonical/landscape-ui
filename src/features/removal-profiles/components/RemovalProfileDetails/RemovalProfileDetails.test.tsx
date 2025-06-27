import { accessGroups } from "@/tests/mocks/accessGroup";
import { removalProfiles } from "@/tests/mocks/removalProfiles";
import { renderWithProviders } from "@/tests/render";
import { screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it } from "vitest";
import RemovalProfileDetails from "./RemovalProfileDetails";

const [profile] = removalProfiles;
const accessGroupOptions = accessGroups.map((group) => ({
  label: group.title,
  value: group.name,
}));

describe("RemovalProfileDetails", () => {
  const user = userEvent.setup();

  it("renders all info items correctly", () => {
    const { container } = renderWithProviders(
      <RemovalProfileDetails
        profile={profile}
        accessGroupOptions={accessGroupOptions}
      />,
    );

    const accessGroup =
      accessGroupOptions.find((option) => option.value === profile.access_group)
        ?.label ?? profile.access_group;

    const fields = [
      { label: "Name", value: profile.title },
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

  it("renders Edit and Remove buttons with correct aria-labels", () => {
    renderWithProviders(
      <RemovalProfileDetails
        profile={profile}
        accessGroupOptions={accessGroupOptions}
      />,
    );

    const editButton = screen.getByRole("button", {
      name: `Edit ${profile.title}`,
    });
    const removeButton = screen.getByRole("button", {
      name: `Remove ${profile.title}`,
    });

    expect(editButton).toBeInTheDocument();
    expect(removeButton).toBeInTheDocument();
  });

  it("opens modal and enables remove button after confirmation text", async () => {
    renderWithProviders(
      <RemovalProfileDetails
        profile={profile}
        accessGroupOptions={accessGroupOptions}
      />,
    );

    await user.click(
      screen.getByRole("button", { name: `Remove ${profile.title}` }),
    );

    expect(
      screen.getByRole("heading", { name: /remove package profile/i }),
    ).toBeInTheDocument();

    const removeButton = screen.getByRole("button", { name: "Remove" });
    expect(removeButton).toBeDisabled();

    await user.type(screen.getByRole("textbox"), `remove ${profile.name}`);
    expect(removeButton).toBeEnabled();
  });
});
