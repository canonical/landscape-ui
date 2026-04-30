import { expectLoadingState } from "@/tests/helpers";
import { packageProfiles } from "@/tests/mocks/package-profiles";
import { renderWithProviders } from "@/tests/render";
import { screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect } from "vitest";
import PackageProfilesPage from "./PackageProfilesPage";
import type * as actualModule from "@/features/profiles";

vi.mock("@/features/profiles", async () => {
  const actual = await vi.importActual<typeof actualModule>(
    "@/features/profiles",
  );

  return {
    ...actual,
    ProfilesContainer: () => <div>Package profiles table</div>,
  };
});

describe("PackageProfilesPage", () => {
  it("has a button to add a profile", async () => {
    renderWithProviders(<PackageProfilesPage />);

    const user = userEvent.setup();

    await user.click(
      await screen.findByRole("button", { name: "Add profile" }),
    );
    await expectLoadingState();

    expect(
      await screen.findByRole("heading", { name: "Add package profile" }),
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
      `/?sidePath=add-constraints&name=${packageProfiles[0].name}`,
    );

    await expectLoadingState();
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
      `/?sidePath=duplicate&name=${packageProfiles[0].name}`,
    );

    await expectLoadingState();
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
      `/?sidePath=edit&name=${packageProfiles[0].name}`,
    );

    await expectLoadingState();
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
      `/?sidePath=edit-constraints&name=${packageProfiles[0].name}`,
    );

    await expectLoadingState();
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
      `/?sidePath=view&name=${packageProfiles[0].name}`,
    );

    await expectLoadingState();
    expect(
      await within(screen.getByLabelText("Side panel")).findByRole("heading", {
        name: packageProfiles[0].title,
      }),
    ).toBeInTheDocument();
  });
});
