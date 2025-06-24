import { scriptProfiles } from "@/tests/mocks/scriptProfiles";
import { renderWithProviders } from "@/tests/render";
import { screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import ScriptProfileActivityHistory from "./ScriptProfileActivityHistory";
import { setEndpointStatus } from "@/tests/controllers/controller";
import { expectLoadingState } from "@/tests/helpers";

describe("ScriptProfileActivityHistory", () => {
  it("should show an activity list", async () => {
    setEndpointStatus("default");
    renderWithProviders(
      <ScriptProfileActivityHistory profile={scriptProfiles[0]} />,
    );

    await expectLoadingState();

    const table = await screen.findByRole("table");
    expect(table).toBeInTheDocument();
    expect(table).toHaveTextContent("Run");
    expect(table).toHaveTextContent("Status");
  });

  it("should show an empty state", async () => {
    setEndpointStatus({
      status: "empty",
      path: "script-profiles/:profileId/activities",
    });
    renderWithProviders(
      <ScriptProfileActivityHistory profile={scriptProfiles[0]} />,
    );

    await expectLoadingState();
    expect(
      screen.getByText(/the profile has not run yet/i),
    ).toBeInTheDocument();
  });
});
