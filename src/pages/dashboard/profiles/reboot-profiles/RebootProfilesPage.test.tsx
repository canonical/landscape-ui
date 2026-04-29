import { rebootProfiles } from "@/tests/mocks/rebootProfiles";
import { renderWithProviders } from "@/tests/render";
import { screen, within } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import RebootProfilesPage from "./RebootProfilesPage";
import { expectLoadingState } from "@/tests/helpers";
import userEvent from "@testing-library/user-event";
import type * as actualModule from "@/features/profiles";

vi.mock("@/features/profiles", async () => {
  const actual = await vi.importActual<typeof actualModule>(
    "@/features/profiles",
  );

  return {
    ...actual,
    ProfilesContainer: () => <div>Reboot profiles table</div>,
  };
});

describe("RebootProfilesPage", () => {
  it("has a button to add a profile", async () => {
    renderWithProviders(<RebootProfilesPage />);

    const user = userEvent.setup();

    await user.click(
      await screen.findByRole("button", { name: "Add profile" }),
    );
    await expectLoadingState();

    expect(
      await screen.findByRole("heading", { name: "Add reboot profile" }),
    ).toBeInTheDocument();
    await user.click(screen.getByLabelText("Close"));

    expect(
      screen.queryByRole("heading", { name: "Add reboot profile" }),
    ).not.toBeInTheDocument();
  });

  it("renders a side panel to duplicate", async () => {
    renderWithProviders(
      <RebootProfilesPage />,
      undefined,
      `/?sidePath=duplicate&name=${rebootProfiles[0].id}`,
    );

    await expectLoadingState();
    expect(
      await within(screen.getByLabelText("Side panel")).findByRole("heading", {
        name: `Duplicate ${rebootProfiles[0].title}`,
      }),
    ).toBeInTheDocument();
  });

  it("renders a side panel to edit", async () => {
    renderWithProviders(
      <RebootProfilesPage />,
      undefined,
      `/?sidePath=edit&name=${rebootProfiles[0].id}`,
    );

    await expectLoadingState();
    expect(
      await within(screen.getByLabelText("Side panel")).findByRole("heading", {
        name: `Edit ${rebootProfiles[0].title}`,
      }),
    ).toBeInTheDocument();
  });

  it("renders a side panel to view", async () => {
    renderWithProviders(
      <RebootProfilesPage />,
      undefined,
      `/?sidePath=view&name=${rebootProfiles[0].id}`,
    );

    await expectLoadingState();
    expect(
      await within(screen.getByLabelText("Side panel")).findByRole("heading", {
        name: rebootProfiles[0].title,
      }),
    ).toBeInTheDocument();
  });
});
