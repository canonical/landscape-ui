import { upgradeProfiles } from "@/tests/mocks/upgrade-profiles";
import { renderWithProviders } from "@/tests/render";
import { screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import UpgradeProfileEditSidePanel from "./UpgradeProfileEditSidePanel";

const [upgradeProfile] = upgradeProfiles;

describe("UpgradeProfileEditSidePanel", () => {
  it("renders a loading state while the profile is being fetched", () => {
    renderWithProviders(<UpgradeProfileEditSidePanel />);

    expect(screen.getByRole("status")).toBeInTheDocument();
  });

  it("renders the edit header and form for the loaded profile", async () => {
    renderWithProviders(
      <UpgradeProfileEditSidePanel />,
      undefined,
      `/?name=${upgradeProfile.id}`,
    );

    expect(
      await screen.findByText(`Edit ${upgradeProfile.title}`),
    ).toBeInTheDocument();
    expect(
      await screen.findByRole("button", { name: "Save changes" }),
    ).toBeInTheDocument();
  });
});
