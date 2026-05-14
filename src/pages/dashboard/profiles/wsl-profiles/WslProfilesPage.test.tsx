import { wslProfiles } from "@/tests/mocks/wsl-profiles";
import { renderWithProviders } from "@/tests/render";
import { screen, within } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import WslProfilesPage from "./WslProfilesPage";
import userEvent from "@testing-library/user-event";
import { expectLoadingState } from "@/tests/helpers";
import type * as actualModule from "@/features/profiles";

vi.mock("@/features/profiles", async () => {
  const actual = await vi.importActual<typeof actualModule>(
    "@/features/profiles",
  );

  return {
    ...actual,
    ProfilesContainer: () => <div>WSL profiles table</div>,
  };
});

describe("WslProfilesPage", () => {
  it("has a button to add a profile", async () => {
    renderWithProviders(<WslProfilesPage />, undefined, "/profiles/wsl");
    const user = userEvent.setup();

    await user.click(
      await screen.findByRole("button", { name: "Add profile" }),
    );

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
      `/?sidePath=edit&name=${wslProfiles[0].name}`,
    );

    await expectLoadingState();
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
      `/?sidePath=view&name=${wslProfiles[0].name}`,
    );

    await expectLoadingState();
    expect(
      await within(screen.getByLabelText("Side panel")).findByRole("heading", {
        name: wslProfiles[0].title,
      }),
    ).toBeInTheDocument();
  });
});
