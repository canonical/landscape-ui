import { renderWithProviders } from "@/tests/render";
import { screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, it, expect } from "vitest";
import { packageProfiles } from "@/tests/mocks/package-profiles";
import { accessGroups } from "@/tests/mocks/accessGroup";
import PackageProfileDetails from "./PackageProfileDetails";

const [profile] = packageProfiles;

describe("PackageProfileDetails", () => {
  const user = userEvent.setup();

  beforeEach(() => {
    renderWithProviders(<PackageProfileDetails profile={profile} />);
  });

  it("renders all info items correctly", async () => {
    const accessGroupTitle = accessGroups.find(
      (ag) => ag.name === profile.access_group,
    )?.title;

    assert(accessGroupTitle);
    const accessGroupItem = await screen.findByText("Access group");

    expect(screen.getByText(profile.title)).toBeInTheDocument();
    expect(screen.getByText(profile.description)).toBeInTheDocument();
    expect(accessGroupItem).toBeInTheDocument();
    expect(screen.getByText(profile.tags.join(", "))).toBeInTheDocument();
  });

  it("renders action buttons", () => {
    expect(
      screen.getByRole("button", { name: "Duplicate profile" }),
    ).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Edit" })).toBeInTheDocument();
    expect(
      screen.getByRole("button", {
        name: `Remove ${profile.title} package profile`,
      }),
    ).toBeInTheDocument();
  });

  it("opens a modal on remove button click and allows profile removal", async () => {
    await user.click(
      screen.getByRole("button", {
        name: `Remove ${profile.title} package profile`,
      }),
    );

    expect(
      await screen.findByText("Remove package profile"),
    ).toBeInTheDocument();
    const removeButton = screen.getByRole("button", { name: "Remove" });

    const confirmationInput = screen.getByRole("textbox");
    expect(removeButton).toBeDisabled();
    await user.type(confirmationInput, `remove ${profile.name}`);

    expect(removeButton).toBeEnabled();
  });

  it("opens edit form on edit button click", async () => {
    await user.click(screen.getByRole("button", { name: "Edit" }));
    expect(
      await screen.findByRole("heading", { name: "Edit package profile" }),
    ).toBeInTheDocument();
  });

  it("opens duplicate form on duplicate button click", async () => {
    await user.click(screen.getByRole("button", { name: "Duplicate profile" }));
    expect(
      await screen.findByRole("heading", { name: "Duplicate package profile" }),
    ).toBeInTheDocument();
  });
});
