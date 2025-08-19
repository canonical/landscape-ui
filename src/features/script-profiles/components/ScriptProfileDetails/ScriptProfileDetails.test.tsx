import { expectLoadingState } from "@/tests/helpers";
import { scriptProfiles } from "@/tests/mocks/scriptProfiles";
import { renderWithProviders } from "@/tests/render";
import { screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, it } from "vitest";
import ScriptProfileDetailsSidePanel from "./ScriptProfileDetails";

describe("ScriptProfileDetails", () => {
  it("should change tabs", async () => {
    renderWithProviders(
      <ScriptProfileDetailsSidePanel />,
      undefined,
      `/?scriptProfile=${scriptProfiles[0].id}`,
    );

    await expectLoadingState();

    await userEvent.click(screen.getByText("Activity history"));

    await expectLoadingState();

    expect(await screen.findByText("Run")).toBeInTheDocument();
  });
});
