import { setEndpointStatus } from "@/tests/controllers/controller";
import { expectLoadingState } from "@/tests/helpers";
import { renderWithProviders } from "@/tests/render";
import { screen } from "@testing-library/react";
import { describe, expect } from "vitest";
import { scriptProfiles } from "@/tests/mocks/scriptProfiles";
import ScriptProfilesPanel from "./ScriptProfilesPanel";

describe("ScriptProfilesPanel", () => {
  it("renders list of script profiles", async () => {
    setEndpointStatus("default");

    renderWithProviders(
      <ScriptProfilesPanel />,
      undefined,
      "/scripts?tab=profiles&pageSize=2",
    );

    await expectLoadingState();

    const nonArchivedProfiles = scriptProfiles
      .filter((profile) => !profile.archived)
      .slice(0, 2);

    for (const scriptProfile of nonArchivedProfiles) {
      expect(screen.getByText(scriptProfile.title)).toBeInTheDocument();
    }

    expect(
      screen.queryByText(
        /to be able to add new profiles you must archive an active one/i,
      ),
    ).toBeInTheDocument();
  });

  it("renders empty state when no script profiles are found", async () => {
    setEndpointStatus({
      status: "empty",
      path: "script-profiles",
    });

    renderWithProviders(<ScriptProfilesPanel />);

    await expectLoadingState();
    expect(
      screen.getByText(/you don't have any script profiles yet./i),
    ).toBeInTheDocument();
  });

  it("renders empty state when no scripts are found", async () => {
    setEndpointStatus({
      status: "empty",
      path: "script-profiles, scripts",
    });

    renderWithProviders(<ScriptProfilesPanel />);

    await expectLoadingState();
    expect(
      screen.getByText(/you need at least one script to add a profile./i),
    ).toBeInTheDocument();
  });
});
