import { removalProfiles } from "@/tests/mocks/removalProfiles";
import { renderWithProviders } from "@/tests/render";
import { screen, within } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import RemovalProfilesPage from "./RemovalProfilesPage";
import { expectLoadingState } from "@/tests/helpers";
import userEvent from "@testing-library/user-event";
import type * as actualModule from "@/features/profiles";

vi.mock("@/features/profiles", async () => {
  const actual = await vi.importActual<typeof actualModule>(
    "@/features/profiles",
  );

  return {
    ...actual,
    ProfilesContainer: () => <div>Removal profiles table</div>,
  };
});

describe("RemovalProfilesPage", () => {
  it("has a button to add a profile", async () => {
    renderWithProviders(<RemovalProfilesPage />);

    const user = userEvent.setup();

    await user.click(
      await screen.findByRole("button", { name: "Add profile" }),
    );
    await expectLoadingState();

    expect(
      await screen.findByRole("heading", { name: "Add removal profile" }),
    ).toBeInTheDocument();
    await user.click(screen.getByLabelText("Close"));

    expect(
      screen.queryByRole("heading", { name: "Add removal profile" }),
    ).not.toBeInTheDocument();
  });

  it("renders a side panel to edit", async () => {
    renderWithProviders(
      <RemovalProfilesPage />,
      undefined,
      `/?sidePath=edit&name=${removalProfiles[0].id}`,
    );

    await expectLoadingState();
    expect(
      await within(screen.getByLabelText("Side panel")).findByRole("heading", {
        name: `Edit ${removalProfiles[0].title}`,
      }),
    ).toBeInTheDocument();
  });

  it("renders a side panel to view", async () => {
    renderWithProviders(
      <RemovalProfilesPage />,
      undefined,
      `/?sidePath=view&name=${removalProfiles[0].id}`,
    );

    await expectLoadingState();
    expect(
      await within(screen.getByLabelText("Side panel")).findByRole("heading", {
        name: removalProfiles[0].title,
      }),
    ).toBeInTheDocument();
  });
});
