import { packageProfiles } from "@/tests/mocks/package-profiles";
import { renderWithProviders } from "@/tests/render";
import { screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import PackageProfileConstraintsEditSidePanel from "./PackageProfileConstraintsEditSidePanel";

const [packageProfile] = packageProfiles;

describe("PackageProfileConstraintsEditSidePanel", () => {
  it("renders a loading state while the profile is being fetched", () => {
    renderWithProviders(<PackageProfileConstraintsEditSidePanel />);

    expect(screen.getByRole("status")).toBeInTheDocument();
  });

  it("renders the header and edit form for the loaded profile", async () => {
    renderWithProviders(
      <PackageProfileConstraintsEditSidePanel />,
      undefined,
      `/?name=${packageProfile.name}`,
    );

    expect(
      await screen.findByText(
        `Change "${packageProfile.title}" profile's constraints`,
      ),
    ).toBeInTheDocument();

    expect(await screen.findByRole("searchbox")).toBeInTheDocument();

    for (const constraint of packageProfile.constraints) {
      expect(
        await screen.findByText(`Toggle ${constraint.package} constraint`),
      ).toBeInTheDocument();
    }
  });
});
