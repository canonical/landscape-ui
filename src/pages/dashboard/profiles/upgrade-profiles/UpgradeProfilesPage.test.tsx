import { upgradeProfiles } from "@/tests/mocks/upgrade-profiles";
import { renderWithProviders } from "@/tests/render";
import { screen, within } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import UpgradeProfilesPage from "./UpgradeProfilesPage";
import userEvent from "@testing-library/user-event";
import { expectLoadingState } from "@/tests/helpers";
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

describe("UpgradeProfilesPage", () => {
  const [selectedUpgradeProfile] = upgradeProfiles;

  it("has a button to add a profile", async () => {
    renderWithProviders(<UpgradeProfilesPage />);
    const user = userEvent.setup();

    await user.click(
      await screen.findByRole("button", { name: "Add profile" }),
    );
    await expectLoadingState();

    expect(
      await screen.findByRole("heading", { name: "Add upgrade profile" }),
    ).toBeInTheDocument();
    await user.click(screen.getByLabelText("Close"));

    expect(
      screen.queryByRole("heading", { name: "Add upgrade profile" }),
    ).not.toBeInTheDocument();
  });

  it("renders a side panel to edit", async () => {
    renderWithProviders(
      <UpgradeProfilesPage />,
      undefined,
      `/?sidePath=edit&name=${selectedUpgradeProfile.id}`,
    );

    await expectLoadingState();
    expect(
      await within(screen.getByLabelText("Side panel")).findByRole("heading", {
        name: `Edit ${selectedUpgradeProfile.title}`,
      }),
    ).toBeInTheDocument();
  });

  it("renders a side panel to view", async () => {
    renderWithProviders(
      <UpgradeProfilesPage />,
      undefined,
      `/?sidePath=view&name=${selectedUpgradeProfile.id}`,
    );

    await expectLoadingState();
    expect(
      await within(screen.getByLabelText("Side panel")).findByRole("heading", {
        name: selectedUpgradeProfile.title,
      }),
    ).toBeInTheDocument();
  });
});
