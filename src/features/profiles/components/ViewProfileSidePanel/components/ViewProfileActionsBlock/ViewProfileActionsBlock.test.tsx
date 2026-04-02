import { renderWithProviders } from "@/tests/render";
import { setScreenSize } from "@/tests/helpers";
import { screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it } from "vitest";
import { ProfileTypes } from "../../../../helpers";
import ViewProfileActionsBlock from "./ViewProfileActionsBlock";
import { profiles } from "@/tests/mocks/profiles";

const [baseProfile] = profiles;

const actionLabels = {
  security: ["Edit", "Download audit", "Run", "Duplicate", "Archive"],
  package: ["Edit", "Edit package constraints", "Duplicate", "Remove"],
  reboot: ["Edit", "Duplicate", "Remove"],
  script: ["Edit", "Archive"],
  default: ["Edit", "Remove"],
  archivedSecurity: ["Download audit", "Duplicate"],
} as const;

describe("ViewProfileActionsBlock", () => {
  beforeEach(() => {
    setScreenSize("sm");
  });

  it("shows archived notification for archived script profiles", () => {
    const archivedScriptProfile = {
      ...baseProfile,
      archived: true,
      script_id: 10,
      last_edited_at: "2024-01-01T00:00:00Z",
    };

    renderWithProviders(
      <ViewProfileActionsBlock
        profile={archivedScriptProfile}
        type={ProfileTypes.script}
      />,
    );

    expect(screen.getByText("Profile archived:")).toBeInTheDocument();
    expect(
      screen.getByText(/The profile was archived on/i),
    ).toBeInTheDocument();
    expect(screen.queryByRole("button")).not.toBeInTheDocument();
  });

  it("opens removal modal for default profiles", async () => {
    renderWithProviders(
      <ViewProfileActionsBlock
        profile={baseProfile}
        type={ProfileTypes.repository}
      />,
    );

    expect(
      screen.queryByText("Remove repository profile"),
    ).not.toBeInTheDocument();

    await userEvent.click(
      await screen.findByRole("button", { name: /remove/i }),
    );
    expect(
      await screen.findByText("Remove repository profile"),
    ).toBeInTheDocument();
  });

  it("opens archival modal for script profile", async () => {
    renderWithProviders(
      <ViewProfileActionsBlock
        profile={{ ...baseProfile, script_id: 1 }}
        type={ProfileTypes.script}
      />,
    );

    expect(
      screen.queryByText("Archive script profile"),
    ).not.toBeInTheDocument();

    await userEvent.click(
      await screen.findByRole("button", { name: /archive/i }),
    );
    expect(
      await screen.findByText("Archive script profile"),
    ).toBeInTheDocument();
  });

  it.each([
    ["default", baseProfile, ProfileTypes.repository, actionLabels.default],
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
  ])(
    `displays the proper actions for %s profile`,
    async (_, profile, type, actions) => {
      renderWithProviders(
        <ViewProfileActionsBlock profile={profile} type={type} />,
      );

      const buttons = screen.getAllByRole("button");
      expect(buttons.length).toEqual(actions.length);

      for (let i = 0; i < actions.length; i++) {
        expect(buttons[i]).toHaveTextContent(actions[i] ?? "");
      }
    },
  );

  it.each([
    [
      "security",
      { ...baseProfile, benchmark: "cis_level1_workstation" },
      ProfileTypes.security,
      actionLabels.security,
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
  ])(
    `displays the proper actions for %s profile`,
    async (_, profile, type, actions) => {
      renderWithProviders(
        <ViewProfileActionsBlock profile={profile} type={type} />,
      );

      await userEvent.click(screen.getByRole("button", { name: /actions/i }));

      const buttons = screen.getAllByRole("button");
      expect(buttons.length).toEqual(actions.length + 1);

      for (let i = 0; i < actions.length; i++) {
        expect(buttons[i + 1]).toHaveTextContent(actions[i] ?? "");
      }
    },
  );
});
