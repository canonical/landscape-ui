import { wslProfiles } from "@/tests/mocks/wsl-profiles";
import { renderWithProviders } from "@/tests/render";
import { screen, within } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import WslProfilesPage from "./WslProfilesPage";
import userEvent from "@testing-library/user-event";
import { expectLoadingState } from "@/tests/helpers";

describe("WslProfilesPage", () => {
  it("has a button to add a profile", async () => {
    renderWithProviders(<WslProfilesPage />);
    const user = userEvent.setup();

    await user.click(
      await screen.findByRole("button", { name: "Add profile" }),
    );
    await expectLoadingState();

    expect(
      await screen.findByRole("heading", { name: "Add WSL profile" }),
    ).toBeInTheDocument();
    await user.click(screen.getByLabelText("Close"));

    expect(
      screen.queryByRole("heading", { name: "Add WSL profile" }),
    ).not.toBeInTheDocument();
  });

  it("renders a side panel to edit", async () => {
    renderWithProviders(
      <WslProfilesPage />,
      undefined,
      `/?sidePath=edit&profile=${wslProfiles[0].name}`,
    );

    expect(
      await within(screen.getByLabelText("Side panel")).findByRole("heading", {
        name: `Edit ${wslProfiles[0].title}`,
      }),
    ).toBeInTheDocument();
  });

  it("renders a side panel to view", async () => {
    renderWithProviders(
      <WslProfilesPage />,
      undefined,
      `/?sidePath=view&profile=${wslProfiles[0].name}`,
    );

    await expectLoadingState();
    expect(
      await within(screen.getByLabelText("Side panel")).findByRole("heading", {
        name: wslProfiles[0].title,
      }),
    ).toBeInTheDocument();
  });
});
