import { packageProfiles } from "@/tests/mocks/package-profiles";
import { renderWithProviders } from "@/tests/render";
import { screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import PackageProfileDuplicateSidePanel from "./PackageProfileDuplicateSidePanel";

const [packageProfile] = packageProfiles;

describe("PackageProfileDuplicateSidePanel", () => {
  it("renders a loading state while the profile is being fetched", () => {
    renderWithProviders(<PackageProfileDuplicateSidePanel />);

    expect(screen.getByRole("status")).toBeInTheDocument();
  });

  it("renders the duplicate header and form for the loaded profile", async () => {
    renderWithProviders(
      <PackageProfileDuplicateSidePanel />,
      undefined,
      `/?name=${packageProfile.name}`,
    );

    expect(
      await screen.findByText(`Duplicate ${packageProfile.title}`),
    ).toBeInTheDocument();
    expect(
      await screen.findByRole("button", { name: "Duplicate" }),
    ).toBeInTheDocument();
  });
});
