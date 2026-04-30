import { scriptProfiles } from "@/tests/mocks/scriptProfiles";
import { renderWithProviders } from "@/tests/render";
import { screen, within } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import ScriptProfilesTab from "./ScriptProfilesTab";
import { expectLoadingState } from "@/tests/helpers";
import userEvent from "@testing-library/user-event";

describe("ScriptProfilesTab", () => {
  it("has a button to add a profile", async () => {
    renderWithProviders(<ScriptProfilesTab />);

    const user = userEvent.setup();

    await user.click(
      await screen.findByRole("button", { name: "Add profile" }),
    );
    await expectLoadingState();

    expect(
      await screen.findByRole("heading", { name: "Add script profile" }),
    ).toBeInTheDocument();
    await user.click(screen.getByLabelText("Close"));

    expect(
      screen.queryByRole("heading", { name: "Add script profile" }),
    ).not.toBeInTheDocument();
  });

  it("renders a side panel to edit", async () => {
    renderWithProviders(
      <ScriptProfilesTab />,
      undefined,
      `/?sidePath=edit&name=${scriptProfiles[0].id}`,
    );

    await expectLoadingState();
    expect(
      await within(screen.getByLabelText("Side panel")).findByRole("heading", {
        name: `Edit ${scriptProfiles[0].title}`,
      }),
    ).toBeInTheDocument();
  });

  it("renders a side panel to view", async () => {
    renderWithProviders(
      <ScriptProfilesTab />,
      undefined,
      `/?sidePath=view&name=${scriptProfiles[0].id}`,
    );

    await expectLoadingState();
    expect(
      await within(screen.getByLabelText("Side panel")).findByRole("heading", {
        name: scriptProfiles[0].title,
      }),
    ).toBeInTheDocument();
  });
});
