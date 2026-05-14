import { renderWithProviders } from "@/tests/render";
import { screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import ViewProfileDetailsBlock from "./ViewProfileDetailsBlock";
import { profiles } from "@/tests/mocks/profiles";

vi.mock(
  "@/features/script-profiles/components/ViewScriptProfileDetailsBlock",
  () => ({
    default: () => <div>script details</div>,
  }),
);
vi.mock(
  "@/features/removal-profiles/components/ViewRemovalProfileDetailsBlock",
  () => ({
    default: () => <div>removal details</div>,
  }),
);
vi.mock(
  "@/features/usg-profiles/components/ViewUSGProfileDetailsBlock",
  () => ({
    default: () => <div>usg details</div>,
  }),
);
vi.mock(
  "@/features/upgrade-profiles/components/ViewUpgradeProfileDetailsBlock",
  () => ({
    default: () => <div>upgrade details</div>,
  }),
);
vi.mock(
  "@/features/wsl-profiles/components/ViewWslProfileDetailsBlock",
  () => ({
    default: () => <div>wsl details</div>,
  }),
);

const [baseProfile] = profiles;

describe("ViewProfileDetailsBlock", () => {
  it.each([
    ["removal", { ...baseProfile, days_without_exchange: 30 }],
    ["script", { ...baseProfile, script_id: 3 }],
    ["usg", { ...baseProfile, benchmark: "disa_stig" }],
    ["upgrade", { ...baseProfile, upgrade_type: "all" }],
    ["wsl", { ...baseProfile, image_name: "image" }],
  ])("renders details block for %s profiles", async (type, profile) => {
    renderWithProviders(<ViewProfileDetailsBlock profile={profile} />);

    expect(
      await screen.findByRole("heading", { name: /Details/i }),
    ).toBeInTheDocument();
    expect(await screen.findByText(type + " details")).toBeInTheDocument();
  });

  it("renders nothing when profile type is unsupported", () => {
    renderWithProviders(<ViewProfileDetailsBlock profile={baseProfile} />);

    expect(screen.queryByText(/Details/i)).not.toBeInTheDocument();
  });
});
