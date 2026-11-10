import { renderWithProviders } from "@/tests/render";
import { setScreenSize } from "@/tests/helpers";
import { screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it } from "vitest";
import { ProfileTypes } from "../../../../helpers";
import ViewProfileActionsBlock from "./ViewProfileActionsBlock";
import { profiles } from "@/tests/mocks/profiles";
import { API_URL } from "@/constants";
import { activityParents } from "@/tests/mocks/activity";
import { usgProfiles } from "@/tests/mocks/usgProfiles";
import { getLocationDisplay, LocationDisplay } from "@/tests/LocationDisplay";
import server from "@/tests/server";
import { http, HttpResponse } from "msw";

const [baseProfile] = profiles;

const actionLabels = {
  usg: ["Edit", "Download audit", "Run", "Duplicate", "Archive"],
  package: ["Edit", "Edit package constraints", "Duplicate", "Remove"],
  reboot: ["Edit", "Duplicate", "Remove"],
  script: ["Edit", "Archive"],
  default: ["Edit", "Remove"],
  archivedUsg: ["Download audit", "Duplicate"],
} as const;

describe("ViewProfileActionsBlock", () => {
  beforeEach(() => {
    setScreenSize("sm");
  });

  it("opens large local group details from the audit-run notification", async () => {
    const [, profile] = usgProfiles;
    const [group] = activityParents;
    assert(group);
    server.use(
      http.post(`${API_URL}usg-profiles/:id\\:execute`, () =>
        HttpResponse.json(group),
      ),
      http.get(`${API_URL}activities/:id`, () => HttpResponse.json(group)),
      http.get(`${API_URL}activities`, () =>
        HttpResponse.json({ results: [], count: 0 }),
      ),
    );
    renderWithProviders(
      <>
        <ViewProfileActionsBlock profile={profile} type={ProfileTypes.usg} />
        <LocationDisplay />
      </>,
      undefined,
      "/profiles/usg?sidePath=view&name=1",
    );
    await userEvent.click(
      await screen.findByRole("button", { name: "Actions" }),
    );
    await userEvent.click(await screen.findByRole("button", { name: "Run" }));
    await userEvent.click(
      await screen.findByRole("button", { name: "View details" }),
    );
    const heading = await screen.findByRole("heading", { name: group.summary });
    expect(heading.closest("aside")).toHaveClass("is-wide");
    expect(
      await screen.findByRole("heading", { name: "Activities" }),
    ).toBeInTheDocument();
    expect(getLocationDisplay()).toHaveTextContent("/profiles/usg");
    expect(getLocationDisplay()).not.toHaveTextContent("/activities");
    expect(getLocationDisplay()).not.toHaveTextContent("sidePath");
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
      "archived USG",
      {
        ...baseProfile,
        benchmark: "cis_level1_workstation",
        status: "archived",
      },
      ProfileTypes.usg,
      actionLabels.archivedUsg,
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
      "usg",
      { ...baseProfile, benchmark: "cis_level1_workstation" },
      ProfileTypes.usg,
      actionLabels.usg,
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
