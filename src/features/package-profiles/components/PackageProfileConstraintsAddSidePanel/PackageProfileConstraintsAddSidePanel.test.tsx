import { packageProfiles } from "@/tests/mocks/package-profiles";
import { renderWithProviders } from "@/tests/render";
import { screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import PackageProfileConstraintsAddSidePanel from "./PackageProfileConstraintsAddSidePanel";

const [packageProfile] = packageProfiles;

describe("PackageProfileConstraintsAddSidePanel", () => {
  it("renders loading state while the profile is being fetched", () => {
    renderWithProviders(<PackageProfileConstraintsAddSidePanel />);

    expect(screen.getByRole("status")).toBeInTheDocument();
  });

  it("renders header and add form for the loaded profile", async () => {
    renderWithProviders(
      <PackageProfileConstraintsAddSidePanel />,
      undefined,
      `/?name=${packageProfile.name}`,
    );

    expect(
      await screen.findByText(
        `Add package constraints to "${packageProfile.title}" profile`,
      ),
    ).toBeInTheDocument();
    expect(
      await screen.findByRole("button", { name: /add new constraint/i }),
    ).toBeInTheDocument();
  });
});
