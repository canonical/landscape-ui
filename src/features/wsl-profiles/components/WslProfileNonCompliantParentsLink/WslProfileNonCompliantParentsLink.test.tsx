import { expectLoadingState } from "@/tests/helpers";
import { wslProfiles } from "@/tests/mocks/wsl-profiles";
import { renderWithProviders } from "@/tests/render";
import { screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe } from "vitest";
import WslProfileNonCompliantParentsLink from "./WslProfileNonCompliantParentsLink";

describe("WslProfileNonCompliantParentsLink", () => {
  it("should open a list of noncompliant parents", async () => {
    renderWithProviders(
      <WslProfileNonCompliantParentsLink wslProfile={wslProfiles[0]} />,
    );

    await userEvent.click(screen.getByRole("button"));

    await expectLoadingState();

    expect(
      screen.getByText(`Instances not compliant with ${wslProfiles[0].title}`),
    ).toBeInTheDocument();
  });
});
