import { expectLoadingState } from "@/tests/helpers";
import { rebootProfiles } from "@/tests/mocks/rebootProfiles";
import { renderWithProviders } from "@/tests/render";
import { screen } from "@testing-library/react";
import { describe, expect } from "vitest";
import RebootProfileEditSidePanel from "./RebootProfileEditSidePanel";

describe("PackageProfileAddSidePanel", () => {
  it("renders", async () => {
    const [rebootProfile] = rebootProfiles;

    renderWithProviders(
      <RebootProfileEditSidePanel />,
      undefined,
      `/?profile=${rebootProfile.id}`,
    );

    await expectLoadingState();
    expect(
      screen.getByRole("heading", { name: `Edit ${rebootProfile.title}` }),
    ).toBeInTheDocument();
  });
});
