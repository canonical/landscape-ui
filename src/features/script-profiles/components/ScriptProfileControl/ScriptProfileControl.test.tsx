import { scriptProfiles } from "@/tests/mocks/scriptProfiles";
import { renderWithProviders } from "@/tests/render";
import { screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import type { ComponentProps } from "react";
import { describe, expect, it } from "vitest";
import ScriptProfileControl from "./ScriptProfileControl";

describe("ScriptProfileControl", () => {
  const props: ComponentProps<typeof ScriptProfileControl> = {
    profile: scriptProfiles[0],
  };

  it("should have action buttons", async () => {
    renderWithProviders(<ScriptProfileControl {...props} />);

    await userEvent.click(screen.getByRole("button", { name: "Edit" }));

    await userEvent.click(screen.getByRole("button", { name: "Archive" }));
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
