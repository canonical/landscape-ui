import { renderWithProviders } from "@/tests/render";
import { screen, within } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import ProfilesList from "./ProfilesList";
import { ProfileTypes } from "../../helpers";
import { profiles } from "@/tests/mocks/profiles";
import { NO_DATA_TEXT } from "@/components/layout/NoData";
import { securityProfiles } from "@/tests/mocks/securityProfiles";
import { capitalize } from "@/utils/_helpers";
import { wslProfiles } from "@/tests/mocks/wsl-profiles";

describe("ProfilesList", () => {
  it.each([
    [
      ProfileTypes.repository,
      ["Profile name", "Access group", "Associated", "Actions"],
    ],
    [
      ProfileTypes.package,
      [
        "Profile name",
        "Access group",
        "Associated",
        "Compliant",
        "Not compliant",
        "Actions",
      ],
    ],
    [
      ProfileTypes.reboot,
      ["Profile name", "Access group", "Associated", "Next restart", "Actions"],
    ],
    [
      ProfileTypes.removal,
      [
        "Profile name",
        "Access group",
        "Associated",
        "Removal timeframe",
        "Actions",
      ],
    ],
    [
      ProfileTypes.script,
      [
        "Profile name",
        "Status",
        "Access group",
        "Associated",
        "Last run",
        "Trigger",
        "Actions",
      ],
    ],
    [
      ProfileTypes.security,
      [
        "Profile name",
        "Status",
        "Access group",
        "Associated",
        "Pass rate",
        "Last runSchedule",
        "Mode",
        "Actions",
      ],
    ],
    [
      ProfileTypes.upgrade,
      ["Profile name", "Access group", "Associated", "Actions"],
    ],
    [
      ProfileTypes.wsl,
      [
        "Profile name",
        "Access group",
        "Associated",
        "Compliant",
        "Not compliant",
        "Actions",
      ],
    ],
  ])("renders table headers for %s profile", async (type, expected) => {
    renderWithProviders(<ProfilesList profiles={profiles} type={type} />);

    const headers = await screen.findAllByRole("columnheader");
    expect(headers.length).toEqual(expected.length);

    for (let i = 0; i < expected.length; i++) {
      expect(headers[i]).toHaveTextContent(expected[i] ?? "invalid");
    }
  });

  it("filters rows based on search query if no api search", () => {
    renderWithProviders(
      <ProfilesList profiles={profiles} type={ProfileTypes.repository} />,
      undefined,
      "/?search=searchText",
    );

    expect(
      screen.getByText(
        "No repository profiles found according to your search parameters.",
      ),
    ).toBeInTheDocument();
  });

  it("renders rows with security profile data", async () => {
    const selectedProfiles = securityProfiles.slice(0, 2);
    renderWithProviders(
      <ProfilesList profiles={selectedProfiles} type={ProfileTypes.security} />,
    );

    for (const profile of selectedProfiles) {
      const row = screen.getByRole("row", {
        name: (name) => name.includes(profile.title),
      });
      expect(
        within(row).getByRole("button", {
          name: `Open "${profile.title}" profile details`,
        }),
      ).toBeInTheDocument();

      expect(
        within(row).getByText(capitalize(profile.status)),
      ).toBeInTheDocument();

      expect(await within(row).findByText("Global access")).toBeInTheDocument();

      if (profile.associated_instances) {
        expect(
          within(row).getByRole("link", {
            name: `${profile.associated_instances.toLocaleString()} instances`,
          }),
        ).toBeInTheDocument();
      }

      if (profile.last_run_results.timestamp) {
        expect(
          within(row).getByText(profile.last_run_results.passing + " passed"),
        ).toBeInTheDocument();
        expect(
          within(row).getByText(profile.last_run_results.failing + " failed"),
        ).toBeInTheDocument();
      }

      const lastRunSchedule = within(row).getByRole("cell", {
        name: `Last run for ${profile.title} profileSchedule for ${profile.title} profile`,
      });
      expect(
        within(lastRunSchedule).getByText(
          profile.last_run_results.timestamp
            ? "May 15, 2024, 15:47"
            : NO_DATA_TEXT,
        ),
      ).toBeInTheDocument();
      expect(
        within(lastRunSchedule).getByText(
          profile.schedule.includes("COUNT=1") ? "On a date" : "Recurring",
        ),
      ).toBeInTheDocument();

      expect(
        within(row).getByText(
          profile.mode === "audit" ? "Audit only" : "Fix, restart, audit",
        ),
      );

      expect(
        within(row).getByRole("button", {
          name: `"${profile.title}" profile actions`,
        }),
      ).toBeInTheDocument();
    }
  });

  it("renders rows with wsl profile data", async () => {
    renderWithProviders(
      <ProfilesList profiles={wslProfiles} type={ProfileTypes.wsl} />,
    );

    for (const profile of wslProfiles) {
      const row = await screen.findByRole("row", {
        name: (name) => name.includes(profile.title),
      });
      const associatedCount = profile.computers.constrained.length;
      const countText = profile.all_computers
        ? "All"
        : associatedCount.toLocaleString();
      expect(
        within(row).getByRole("link", {
          name: `${countText} instances`,
        }),
      ).toBeInTheDocument();

      const count = associatedCount - profile.computers["non-compliant"].length;
      if (count) {
        expect(
          within(row).getByRole("link", {
            name: `${count} instances`,
          }),
        ).toBeInTheDocument();
      }

      if (profile.computers["non-compliant"].length) {
        expect(
          within(row).getByRole("button", {
            name: `1 instance`,
          }),
        ).toBeInTheDocument();
      }
    }
  });
});
