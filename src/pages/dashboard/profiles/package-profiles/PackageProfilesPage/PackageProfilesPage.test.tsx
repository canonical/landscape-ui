import { expectLoadingState } from "@/tests/helpers";
import { packageProfiles } from "@/tests/mocks/package-profiles";
import { renderWithProviders } from "@/tests/render";
import { screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect } from "vitest";
import PackageProfilesPage from "./PackageProfilesPage";

describe("PackageProfilesPage", () => {
  it("has a button to add a package profile", async () => {
    renderWithProviders(<PackageProfilesPage />);

    const user = userEvent.setup();

    await user.click(
      screen.getByRole("button", { name: "Add package profile" }),
    );
    await expectLoadingState();
    expect(
      screen.getByRole("heading", { name: "Add package profile" }),
    ).toBeInTheDocument();
    await user.click(screen.getByLabelText("Close"));
    expect(
      screen.queryByRole("heading", { name: "Add package profile" }),
    ).not.toBeInTheDocument();
  });

  it("has a side panel to add constraints", async () => {
    renderWithProviders(
      <PackageProfilesPage />,
      undefined,
      `/?sidePath=add-constraints&profile=${packageProfiles[0].name}`,
    );

    expect(
      await within(screen.getByLabelText("Side panel")).findByRole("heading", {
        name: `Add package constraints to "${packageProfiles[0].title}" profile`,
      }),
    ).toBeInTheDocument();
  });

  it("has a side panel to duplicate", async () => {
    renderWithProviders(
      <PackageProfilesPage />,
      undefined,
      `/?sidePath=duplicate&profile=${packageProfiles[0].name}`,
    );

    expect(
      await within(screen.getByLabelText("Side panel")).findByRole("heading", {
        name: `Duplicate ${packageProfiles[0].title}`,
      }),
    ).toBeInTheDocument();
  });

  it("has a side panel to edit", async () => {
    renderWithProviders(
      <PackageProfilesPage />,
      undefined,
      `/?sidePath=edit&profile=${packageProfiles[0].name}`,
    );

    expect(
      await within(screen.getByLabelText("Side panel")).findByRole("heading", {
        name: `Edit ${packageProfiles[0].title}`,
      }),
    ).toBeInTheDocument();
  });

  it("renders a side panel to edit constraints", async () => {
    renderWithProviders(
      <PackageProfilesPage />,
      undefined,
      `/?sidePath=edit-constraints&profile=${packageProfiles[0].name}`,
    );

    expect(
      await within(screen.getByLabelText("Side panel")).findByRole("heading", {
        name: `Change "${packageProfiles[0].title}" profile's constraints`,
      }),
    ).toBeInTheDocument();
  });

  it("renders a side panel to view", async () => {
    renderWithProviders(
      <PackageProfilesPage />,
      undefined,
      `/?sidePath=view&profile=${packageProfiles[0].name}`,
    );

    expect(
      await within(screen.getByLabelText("Side panel")).findByRole("heading", {
        name: packageProfiles[0].title,
      }),
    ).toBeInTheDocument();
  });
});
