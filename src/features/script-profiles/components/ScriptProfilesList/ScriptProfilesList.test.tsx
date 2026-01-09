import { NO_DATA_TEXT } from "@/components/layout/NoData";
import { DISPLAY_DATE_TIME_FORMAT } from "@/constants";
import { scriptProfiles } from "@/tests/mocks/scriptProfiles";
import { renderWithProviders } from "@/tests/render";
import { screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import moment from "moment";
import { describe, expect, it } from "vitest";
import { getTriggerText } from "../../helpers";
import ScriptProfileList from "./ScriptProfilesList";

describe("ScriptProfileList", () => {
  const user = userEvent.setup();

  const activeProfile = scriptProfiles.find((profile) => !profile.archived);
  const archivedProfile = scriptProfiles.find((profile) => profile.archived);
  assert(activeProfile);
  assert(archivedProfile);

  it("renders the table with correct column headers", () => {
    renderWithProviders(<ScriptProfileList profiles={scriptProfiles} />);

    const table = screen.getByRole("table");
    expect(table).toHaveTexts([
      "Title",
      "Status",
      "Associated instances",
      "Tags",
      "Trigger",
      "Last run",
    ]);
  });

  it("renders script rows with their data", () => {
    const truncatedProfiles = scriptProfiles.slice(0, 5);

    renderWithProviders(<ScriptProfileList profiles={truncatedProfiles} />);

    for (const scriptProfile of truncatedProfiles) {
      const row = screen.getByRole("row", {
        name: (name) => {
          return name.toLowerCase().includes(scriptProfile.title.toLowerCase());
        },
      });
      expect(row).toBeInTheDocument();
      assert(row);

      expect(
        within(row).getByRole("button", { name: scriptProfile.title }),
      ).toBeVisible();

      const statusCell = within(row).getByRole("cell", {
        name: /status/i,
      });

      expect(statusCell).toHaveTextContent(
        scriptProfile.archived ? "Archived" : "Active",
      );

      expect(statusCell).toHaveIcon(
        scriptProfile.archived
          ? "status-queued-small"
          : "status-succeeded-small",
      );

      const triggerCell = within(row).getByRole("cell", {
        name: /trigger/i,
      });
      const triggerText = getTriggerText(scriptProfile);
      assert(triggerText);
      expect(triggerCell).toHaveTextContent(triggerText);

      const lastRunCell = within(row).getByRole("cell", {
        name: /last run/i,
      });
      if (scriptProfile.activities.last_activity) {
        expect(lastRunCell).toHaveTextContent(
          moment(scriptProfile.activities.last_activity.creation_time)
            .utc()
            .format(DISPLAY_DATE_TIME_FORMAT),
        );
      } else {
        expect(lastRunCell).toHaveTextContent(NO_DATA_TEXT);
      }
    }
  });

  it("renders correct actions for archived script profiles", async () => {
    renderWithProviders(<ScriptProfileList profiles={scriptProfiles} />);

    await user.click(
      screen.getByRole("button", {
        name: `${archivedProfile.title} script profile actions`,
      }),
    );

    const viewDetailsButton = screen.getByRole("button", {
      name: `View details`,
    });
    expect(viewDetailsButton).toBeVisible();

    const editButton = screen.queryByRole("button", {
      name: `Edit ${archivedProfile.title}`,
    });
    expect(editButton).not.toBeInTheDocument();
  });

  it("renders correct actions for active script profiles", async () => {
    renderWithProviders(<ScriptProfileList profiles={scriptProfiles} />);

    await user.click(
      screen.getByRole("button", {
        name: `${activeProfile.title} script profile actions`,
      }),
    );

    const viewDetailsButton = screen.getByRole("button", {
      name: `View details`,
    });
    expect(viewDetailsButton).toBeVisible();

    const editButton = screen.queryByRole("button", {
      name: `Edit`,
    });
    expect(editButton).toBeInTheDocument();

    const archiveButton = screen.getByRole("button", {
      name: `Archive`,
    });
    expect(archiveButton).toBeInTheDocument();
  });
});
