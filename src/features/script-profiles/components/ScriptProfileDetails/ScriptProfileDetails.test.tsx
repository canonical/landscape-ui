import { scriptProfiles } from "@/tests/mocks/scriptProfiles";
import { renderWithProviders } from "@/tests/render";
import { screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, it } from "vitest";
import ScriptProfileDetails from "./ScriptProfileDetails";
import { expectLoadingState } from "@/tests/helpers";

describe("ScriptProfileDetails", () => {
  it("should change tabs", async () => {
    renderWithProviders(
      <ScriptProfileDetails
        actions={{
          archive: () => undefined,
          edit: () => undefined,
          viewDetails: () => undefined,
        }}
        profile={scriptProfiles[0]}
      />,
    );
    await expectLoadingState();

    await userEvent.click(screen.getByText("Activity history"));

    expect(screen.getByText("Run")).toBeInTheDocument();
  });
});
