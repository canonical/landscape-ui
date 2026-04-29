import { securityProfiles } from "@/tests/mocks/securityProfiles";
import { renderWithProviders } from "@/tests/render";
import { screen, within } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import SecurityProfilesPage from "./SecurityProfilesPage";
import userEvent from "@testing-library/user-event";
import { expectLoadingState } from "@/tests/helpers";
import type * as actualModule from "@/features/profiles";

vi.mock("@/features/profiles", async () => {
  const actual = await vi.importActual<typeof actualModule>(
    "@/features/profiles",
  );

  return {
    ...actual,
    ProfilesContainer: () => <div>Security profiles table</div>,
  };
});

describe("SecurityProfilesPage", () => {
  it("has a button to add a profile", async () => {
    renderWithProviders(<SecurityProfilesPage />);
    const user = userEvent.setup();

    await user.click(
      await screen.findByRole("button", { name: "Add profile" }),
    );
    await expectLoadingState();

    expect(
      await screen.findByRole("heading", {
        name: "Add security profileStep 1 of 5",
      }),
    ).toBeInTheDocument();
    await user.click(screen.getByLabelText("Close"));

    expect(
      screen.queryByRole("heading", { name: "Add security profile" }),
    ).not.toBeInTheDocument();
  });

  it("renders a side panel to download", async () => {
    renderWithProviders(
      <SecurityProfilesPage />,
      undefined,
      `/?sidePath=download&name=${securityProfiles[1].id}`,
    );

    await expectLoadingState();
    expect(
      await within(screen.getByLabelText("Side panel")).findByRole("heading", {
        name: `Download audit for ${securityProfiles[1].title} security profile`,
      }),
    ).toBeInTheDocument();
  });

  it("renders a side panel to duplicate", async () => {
    renderWithProviders(
      <SecurityProfilesPage />,
      undefined,
      `/?sidePath=duplicate&name=${securityProfiles[1].id}`,
    );

    await expectLoadingState();
    expect(
      await within(screen.getByLabelText("Side panel")).findByRole("heading", {
        name: `Duplicate ${securityProfiles[1].title}`,
      }),
    ).toBeInTheDocument();
  });

  it("renders a side panel to edit", async () => {
    renderWithProviders(
      <SecurityProfilesPage />,
      undefined,
      `/?sidePath=edit&name=${securityProfiles[1].id}`,
    );

    await expectLoadingState();
    expect(
      await within(screen.getByLabelText("Side panel")).findByRole("heading", {
        name: `Edit ${securityProfiles[1].title}`,
      }),
    ).toBeInTheDocument();
  });

  it("renders a side panel to run", async () => {
    renderWithProviders(
      <SecurityProfilesPage />,
      undefined,
      `/?sidePath=run&name=${securityProfiles[1].id}`,
    );

    await expectLoadingState();
    expect(
      await within(screen.getByLabelText("Side panel")).findByRole("heading", {
        name: `Run "${securityProfiles[1].title}" profile`,
      }),
    ).toBeInTheDocument();
  });

  it("renders a side panel to view", async () => {
    renderWithProviders(
      <SecurityProfilesPage />,
      undefined,
      `/?sidePath=view&name=${securityProfiles[1].id}`,
    );

    await expectLoadingState();
    expect(
      await within(screen.getByLabelText("Side panel")).findByRole("heading", {
        name: securityProfiles[1].title,
      }),
    ).toBeInTheDocument();
  });
});
