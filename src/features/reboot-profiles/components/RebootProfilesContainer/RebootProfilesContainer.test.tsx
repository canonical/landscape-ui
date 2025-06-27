import { setEndpointStatus } from "@/tests/controllers/controller";
import { expectLoadingState } from "@/tests/helpers";
import { rebootProfiles } from "@/tests/mocks/rebootProfiles";
import { renderWithProviders } from "@/tests/render";
import { screen, within } from "@testing-library/react";
import { describe, it } from "vitest";
import RebootProfilesContainer from "./RebootProfilesContainer";

describe("RebootProfilesContainer", () => {
  it("renders list of reboot profiles", async () => {
    setEndpointStatus("default");
    renderWithProviders(<RebootProfilesContainer />);

    await expectLoadingState();

    const table = await screen.findByRole("table");

    for (const profile of rebootProfiles) {
      const profileTitleElement = within(table).getByText(profile.title);
      expect(profileTitleElement).toBeInTheDocument();
    }
  });

  it("renders empty-state when no profiles are returned", async () => {
    setEndpointStatus({ status: "empty", path: "rebootprofiles" });
    renderWithProviders(<RebootProfilesContainer />);

    await expectLoadingState();
    expect(
      await screen.findByText(/you don't have any reboot profiles yet/i),
    ).toBeInTheDocument();
  });
});
