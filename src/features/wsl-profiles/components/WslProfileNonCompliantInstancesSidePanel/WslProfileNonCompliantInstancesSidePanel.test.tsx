import SidePanel from "@/components/layout/SidePanel";
import { wslProfiles } from "@/tests/mocks/wsl-profiles";
import { renderWithProviders } from "@/tests/render";
import { screen, within } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import WslProfileNonCompliantInstancesSidePanel from "./WslProfileNonCompliantInstancesSidePanel";

const [wslProfile] = wslProfiles;

describe("WslProfileNonCompliantInstancesSidePanel", () => {
  it("shows a loading state when the profile is not yet available", async () => {
    renderWithProviders(
      <SidePanel onClose={vi.fn()} isOpen>
        <WslProfileNonCompliantInstancesSidePanel wslProfile={undefined} />
      </SidePanel>,
    );

    expect(await screen.findByRole("status")).toBeInTheDocument();
  });

  it("renders the header and non-compliant instances list for the profile", async () => {
    renderWithProviders(
      <SidePanel onClose={vi.fn()} isOpen>
        <WslProfileNonCompliantInstancesSidePanel wslProfile={wslProfile} />
      </SidePanel>,
    );

    expect(
      await within(screen.getByLabelText("Side panel")).findByRole("heading", {
        name: `Instances not compliant with ${wslProfile.title}`,
      }),
    ).toBeInTheDocument();

    expect(await screen.findByRole("searchbox")).toBeInTheDocument();
  });
});
