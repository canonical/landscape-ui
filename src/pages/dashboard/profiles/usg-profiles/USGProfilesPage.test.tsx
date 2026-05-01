import { usgProfiles } from "@/tests/mocks/usgProfiles";
import { renderWithProviders } from "@/tests/render";
import { screen, within } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import USGProfilesPage from "./USGProfilesPage";
import userEvent from "@testing-library/user-event";
import { expectLoadingState } from "@/tests/helpers";
import type * as actualModule from "@/features/profiles";

vi.mock("@/features/profiles", async () => {
  const actual = await vi.importActual<typeof actualModule>(
    "@/features/profiles",
  );

  return {
    ...actual,
    ProfilesContainer: () => <div>USG profiles table</div>,
  };
});

describe("USGProfilesPage", () => {
  it("has a button to add a profile", async () => {
    renderWithProviders(<USGProfilesPage />);
    const user = userEvent.setup();

    await user.click(
      await screen.findByRole("button", { name: "Add profile" }),
    );
    await expectLoadingState();

    expect(
      await screen.findByRole("heading", {
        name: "Add USG profileStep 1 of 5",
      }),
    ).toBeInTheDocument();
    await user.click(screen.getByLabelText("Close"));

    expect(
      screen.queryByRole("heading", { name: "Add USG profile" }),
    ).not.toBeInTheDocument();
  });

  it("renders a side panel to download", async () => {
    renderWithProviders(
      <USGProfilesPage />,
      undefined,
      `/?sidePath=download&name=${usgProfiles[1].id}`,
    );

    await expectLoadingState();
    expect(
      await within(screen.getByLabelText("Side panel")).findByRole("heading", {
        name: `Download audit for ${usgProfiles[1].title} USG profile`,
      }),
    ).toBeInTheDocument();
  });

  it("renders a side panel to duplicate", async () => {
    renderWithProviders(
      <USGProfilesPage />,
      undefined,
      `/?sidePath=duplicate&name=${usgProfiles[1].id}`,
    );

    await expectLoadingState();
    expect(
      await within(screen.getByLabelText("Side panel")).findByRole("heading", {
        name: `Duplicate ${usgProfiles[1].title}`,
      }),
    ).toBeInTheDocument();
  });

  it("renders a side panel to edit", async () => {
    renderWithProviders(
      <USGProfilesPage />,
      undefined,
      `/?sidePath=edit&name=${usgProfiles[1].id}`,
    );

    await expectLoadingState();
    expect(
      await within(screen.getByLabelText("Side panel")).findByRole("heading", {
        name: `Edit ${usgProfiles[1].title}`,
      }),
    ).toBeInTheDocument();
  });

  it("renders a side panel to run", async () => {
    renderWithProviders(
      <USGProfilesPage />,
      undefined,
      `/?sidePath=run&name=${usgProfiles[1].id}`,
    );

    await expectLoadingState();
    expect(
      await within(screen.getByLabelText("Side panel")).findByRole("heading", {
        name: `Run "${usgProfiles[1].title}" profile`,
      }),
    ).toBeInTheDocument();
  });

  it("renders a side panel to view", async () => {
    renderWithProviders(
      <USGProfilesPage />,
      undefined,
      `/?sidePath=view&name=${usgProfiles[1].id}`,
    );

    await expectLoadingState();
    expect(
      await within(screen.getByLabelText("Side panel")).findByRole("heading", {
        name: usgProfiles[1].title,
      }),
    ).toBeInTheDocument();
  });
});
