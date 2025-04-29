import { scriptProfiles } from "@/tests/mocks/scriptProfiles";
import { renderWithProviders } from "@/tests/render";
import { screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import type { ComponentProps } from "react";
import { describe, expect, it } from "vitest";
import ScriptProfileControl from "./ScriptProfileControl";

describe("ScriptProfileControl", () => {
  const props: ComponentProps<typeof ScriptProfileControl> = {
    actions: {
      archive: vi.fn(),
      edit: vi.fn(),
    },
    profile: scriptProfiles[0],
  };

  it("should have action buttons", async () => {
    renderWithProviders(<ScriptProfileControl {...props} />);

    await userEvent.click(screen.getByRole("button", { name: "Edit" }));
    expect(props.actions.edit).toHaveBeenCalledOnce();

    await userEvent.click(screen.getByRole("button", { name: "Archive" }));
    expect(props.actions.archive).toHaveBeenCalledOnce();
  });

  it("should show a warning for an archived profile", () => {
    renderWithProviders(
      <ScriptProfileControl
        {...props}
        profile={{ ...props.profile, archived: true }}
      />,
    );

    expect(screen.getByText("Profile archived:")).toBeInTheDocument();
  });
});
