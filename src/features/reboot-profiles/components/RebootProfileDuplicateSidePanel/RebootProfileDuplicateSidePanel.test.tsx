import { expectLoadingState } from "@/tests/helpers";
import { rebootProfiles } from "@/tests/mocks/rebootProfiles";
import { renderWithProviders } from "@/tests/render";
import { screen } from "@testing-library/react";
import { describe, expect } from "vitest";
import RebootProfileDuplicateSidePanel from "./RebootProfileDuplicateSidePanel";

describe("PackageProfileAddSidePanel", () => {
  it("renders", async () => {
    const [rebootProfile] = rebootProfiles;

    renderWithProviders(
      <RebootProfileDuplicateSidePanel />,
      undefined,
      `/?profile=${rebootProfile.id}`,
    );

    await expectLoadingState();
    expect(
      screen.getByRole("heading", { name: `Duplicate ${rebootProfile.title}` }),
    ).toBeInTheDocument();
  });
});
