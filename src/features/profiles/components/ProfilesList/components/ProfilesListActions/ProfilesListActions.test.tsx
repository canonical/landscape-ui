import { renderWithProviders } from "@/tests/render";
import { screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import ProfilesListActions from "./ProfilesListActions";
import { ProfileTypes } from "../../../../helpers";
import userEvent from "@testing-library/user-event";
import { profiles } from "@/tests/mocks/profiles";

const actionLabels = {
  security: [
    "View details",
    "Edit",
    "Download audit",
    "Run",
    "Duplicate",
    "Archive",
  ],
  package: [
    "View details",
    "Edit",
    "Edit package constraints",
    "Duplicate",
    "Remove",
  ],
  reboot: ["View details", "Edit", "Duplicate", "Remove"],
  script: ["View details", "Edit", "Archive"],
  default: ["View details", "Edit", "Remove"],
  archivedSecurity: ["View details", "Download audit", "Duplicate"],
  archivedScript: ["View details"],
};

const [baseProfile] = profiles;

describe("ProfilesListActions", () => {
  it("opens removal modal for default profiles", async () => {
    renderWithProviders(
      <ProfilesListActions
        profile={baseProfile}
        type={ProfileTypes.repository}
      />,
    );

    expect(
      screen.queryByText("Remove repository profile"),
    ).not.toBeInTheDocument();

    const menu = await screen.findByRole("button", {
      name: `"${baseProfile.title}" profile actions`,
    });
    await userEvent.click(menu);

    await userEvent.click(screen.getByRole("menuitem", { name: /remove/i }));
    expect(
      await screen.findByText("Remove repository profile"),
    ).toBeInTheDocument();
  });

  it("opens archival modal for script profile", async () => {
    renderWithProviders(
      <ProfilesListActions
        profile={{ ...baseProfile, script_id: 1 }}
        type={ProfileTypes.script}
      />,
    );

    expect(
      screen.queryByText("Archive script profile"),
    ).not.toBeInTheDocument();

    const menu = await screen.findByRole("button", {
      name: `"${baseProfile.title}" profile actions`,
    });
    await userEvent.click(menu);

    await userEvent.click(screen.getByRole("menuitem", { name: /archive/i }));
    expect(
      await screen.findByText("Archive script profile"),
    ).toBeInTheDocument();
  });

  it.each([
    ["default", baseProfile, ProfileTypes.repository, actionLabels.default],
    [
      "security",
      { ...baseProfile, benchmark: "cis_level1_workstation" },
      ProfileTypes.security,
      actionLabels.security,
    ],
    [
      "reboot",
      {
        ...baseProfile,
        num_computers: 0,
        schedule: "schedule",
        next_run: "next run",
      },
      ProfileTypes.reboot,
      actionLabels.reboot,
    ],
    [
      "package",
      {
        ...baseProfile,
        constraints: {
          constraint: "depends",
          id: 1,
          package: "package",
          rule: "rule",
          version: "1.0.0",
        },
      },
      ProfileTypes.package,
      actionLabels.package,
    ],
    [
      "script",
      { ...baseProfile, script_id: 3 },
      ProfileTypes.script,
      actionLabels.script,
    ],
    [
      "archived security",
      {
        ...baseProfile,
        benchmark: "cis_level1_workstation",
        status: "archived",
      },
      ProfileTypes.security,
      actionLabels.archivedSecurity,
    ],
    [
      "archived script",
      {
        ...baseProfile,
        script_id: 1,
        archived: true,
      },
      ProfileTypes.script,
      actionLabels.archivedScript,
    ],
  ])(
    `displays the proper actions for %s profile`,
    async (_, profile, type, actions) => {
      renderWithProviders(
        <ProfilesListActions profile={profile} type={type} />,
      );

      await userEvent.click(
        screen.getByRole("button", {
          name: `"${baseProfile.title}" profile actions`,
        }),
      );

      const buttons = screen.getAllByRole("menuitem");
      expect(buttons.length).toEqual(actions.length);

      for (let i = 0; i < actions.length; i++) {
        expect(buttons[i]).toHaveTextContent(actions[i] ?? "invalid");
      }
    },
  );
});
