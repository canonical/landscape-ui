import { renderWithProviders } from "@/tests/render";
import { scriptProfiles } from "@/tests/mocks/scriptProfiles";
import { describe, it } from "vitest";
import ScriptProfileAssociatedInstancesLink from "./ScriptProfileAssociatedInstancesLink";
import { screen } from "@testing-library/react";
import { NO_DATA_TEXT } from "@/components/layout/NoData";
import { pluralize } from "@/utils/_helpers";

const profileWithNoTagsAndNoAllComputers = scriptProfiles.find(
  (profile) => !profile.tags.length && !profile.all_computers,
);

const profileWithEventTriggerAndPostEnrollment = scriptProfiles.find(
  (profile) =>
    profile.trigger.trigger_type === "event" &&
    profile.trigger.event_type === "post_enrollment",
);

const profileWithNoAssociatedInstances = scriptProfiles.find(
  (profile) => !profile.computers.num_associated_computers,
);

const scriptProfile = scriptProfiles.find(
  (profile) =>
    (profile.trigger.trigger_type !== "event" ||
      profile.trigger.event_type !== "post_enrollment") &&
    profile.computers.num_associated_computers > 0,
);

assert(profileWithNoTagsAndNoAllComputers);
assert(profileWithEventTriggerAndPostEnrollment);
assert(profileWithNoAssociatedInstances);
assert(scriptProfile);

describe("ScriptProfileAssociatedInstancesLink", () => {
  it("returns no data for profile with 0 tags and false all computers", async () => {
    renderWithProviders(
      <ScriptProfileAssociatedInstancesLink
        scriptProfile={profileWithNoTagsAndNoAllComputers}
      />,
    );

    expect(screen.getByText(NO_DATA_TEXT)).toBeInTheDocument();
  });

  it("returns no data for profile with event trigger and post enrollment", async () => {
    renderWithProviders(
      <ScriptProfileAssociatedInstancesLink
        scriptProfile={profileWithEventTriggerAndPostEnrollment}
      />,
    );

    expect(screen.getByText(NO_DATA_TEXT)).toBeInTheDocument();
  });

  it("returns 0 instances for profile with no associated instances", async () => {
    renderWithProviders(
      <ScriptProfileAssociatedInstancesLink
        scriptProfile={profileWithNoAssociatedInstances}
      />,
    );

    expect(screen.getByText("0 instances")).toBeInTheDocument();
  });

  it("returns link with number of associated instances for valid profile", async () => {
    renderWithProviders(
      <ScriptProfileAssociatedInstancesLink scriptProfile={scriptProfile} />,
    );

    expect(
      screen.getByRole("link", {
        name: `${scriptProfile.computers.num_associated_computers} ${pluralize(
          scriptProfile.computers.num_associated_computers,
          "instance",
        )}`,
      }),
    ).toBeInTheDocument();
  });
});
