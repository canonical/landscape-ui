import { ProfileTypes } from "@/features/profiles";
import { packageProfiles } from "@/tests/mocks/package-profiles";
import { rebootProfiles } from "@/tests/mocks/rebootProfiles";
import { removalProfiles } from "@/tests/mocks/removalProfiles";
import { upgradeProfiles } from "@/tests/mocks/upgrade-profiles";
import { renderWithProviders } from "@/tests/render";
import { screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import SupportProfileSidePanel from "./SupportProfileSidePanel";

const [taggedRemovalProfile, allInstancesRemovalProfile] = removalProfiles;
const [rebootProfile, , unassociatedRebootProfile] = rebootProfiles;
const [upgradeProfile] = upgradeProfiles;
const [packageProfile] = packageProfiles;

describe("SupportProfileSidePanel", () => {
  assert(taggedRemovalProfile);
  assert(allInstancesRemovalProfile);
  assert(rebootProfile);
  assert(unassociatedRebootProfile);
  assert(upgradeProfile);
  assert(packageProfile);

  it("is loading until the profile arrives", () => {
    renderWithProviders(
      <SupportProfileSidePanel
        type={ProfileTypes.reboot}
        profile={undefined}
      />,
    );

    expect(screen.getByText("Loading...")).toBeInTheDocument();
  });

  it("shows the instance count and the tags of a tagged profile", async () => {
    renderWithProviders(
      <SupportProfileSidePanel
        type={ProfileTypes.removal}
        profile={taggedRemovalProfile}
      />,
    );

    expect(
      await screen.findByRole("heading", { name: taggedRemovalProfile.title }),
    ).toBeInTheDocument();
    expect(await screen.findByText("Association")).toBeInTheDocument();
    expect(screen.getByText("1 instance")).toBeInTheDocument();

    for (const tag of taggedRemovalProfile.tags) {
      expect(screen.getByText(tag)).toBeInTheDocument();
    }
  });

  it("shows a profile associated with all instances, without tags", async () => {
    renderWithProviders(
      <SupportProfileSidePanel
        type={ProfileTypes.removal}
        profile={allInstancesRemovalProfile}
      />,
    );

    expect(await screen.findByText("All instances")).toBeInTheDocument();
    expect(screen.queryByText("Tags")).not.toBeInTheDocument();
  });

  it("says when a profile has no associations", async () => {
    renderWithProviders(
      <SupportProfileSidePanel
        type={ProfileTypes.reboot}
        profile={unassociatedRebootProfile}
      />,
    );

    expect(
      await screen.findByText(
        "This profile has not yet been associated with any instances.",
      ),
    ).toBeInTheDocument();
  });

  it.each([
    [ProfileTypes.reboot, rebootProfile],
    [ProfileTypes.upgrade, upgradeProfile],
  ])("shows the running schedule of a %s profile", async (type, profile) => {
    renderWithProviders(
      <SupportProfileSidePanel type={type} profile={profile} />,
    );

    expect(await screen.findByText("Running schedule")).toBeInTheDocument();
  });

  it("has no running schedule or tabs for a removal profile", async () => {
    renderWithProviders(
      <SupportProfileSidePanel
        type={ProfileTypes.removal}
        profile={taggedRemovalProfile}
      />,
    );

    await screen.findByText("Association");

    expect(screen.queryByText("Running schedule")).not.toBeInTheDocument();
    expect(screen.queryByRole("tab")).not.toBeInTheDocument();
  });

  it("opens a package profile on its Info tab", async () => {
    renderWithProviders(
      <SupportProfileSidePanel
        type={ProfileTypes.package}
        profile={packageProfile}
      />,
    );

    expect(
      (await screen.findAllByRole("tab")).map((tab) => tab.textContent),
    ).toEqual(["Info", "Package constraints"]);
    expect(await screen.findByText("Association")).toBeInTheDocument();
  });
});
