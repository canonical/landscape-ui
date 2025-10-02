import { expectLoadingState } from "@/tests/helpers";
import { removalProfiles } from "@/tests/mocks/removalProfiles";
import { renderWithProviders } from "@/tests/render";
import { screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import RemovalProfileEditSidePanel from "./RemovalProfileEditSidePanel";

describe("RemovalProfileEditSidePanel", () => {
  it("renders", async () => {
    const [removalProfile] = removalProfiles;

    renderWithProviders(
      <RemovalProfileEditSidePanel />,
      undefined,
      `/?profile=${removalProfile.id}`,
    );

    await expectLoadingState();

    expect(
      screen.findByRole("heading", {
        name: `Edit "${removalProfile.title}" profile`,
      }),
    );
  });
});
