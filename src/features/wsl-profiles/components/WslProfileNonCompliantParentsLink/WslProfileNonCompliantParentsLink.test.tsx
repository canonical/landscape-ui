import { wslProfiles } from "@/tests/mocks/wsl-profiles";
import { renderWithProviders } from "@/tests/render";
import { screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe } from "vitest";
import WslProfileNonCompliantParentsLink from "./WslProfileNonCompliantParentsLink";

describe("WslProfileNonCompliantParentsLink", () => {
  it("should open a list of noncompliant parents", async () => {
    const handleClick = vi.fn();

    renderWithProviders(
      <WslProfileNonCompliantParentsLink
        wslProfile={wslProfiles[0]}
        onClick={handleClick}
      />,
    );

    await userEvent.click(screen.getByRole("button"));

    expect(handleClick).toHaveBeenCalledTimes(1);
  });
});
