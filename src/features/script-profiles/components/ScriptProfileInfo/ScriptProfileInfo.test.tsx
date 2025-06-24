import NoData from "@/components/layout/NoData";
import { renderWithProviders } from "@/tests/render";
import { describe, expect, it } from "vitest";
import ScriptProfileInfo from "./ScriptProfileInfo";
import { scriptProfiles } from "@/tests/mocks/scriptProfiles";
import { getStatusText, getTriggerLongText } from "../../helpers";
import { detailedScriptsData } from "@/tests/mocks/script";
import { accessGroups } from "@/tests/mocks/accessGroup";
import { expectLoadingState } from "@/tests/helpers";
import { DISPLAY_DATE_TIME_FORMAT } from "@/constants";
import moment from "moment";

const [profile] = scriptProfiles;
const relatedScript = detailedScriptsData.find(
  (script) => script.id === profile.script_id,
);
const relatedAccessGroup =
  accessGroups.find((group) => group.name === profile.access_group)?.title ||
  profile.access_group;

describe("ScriptProfileInfo", () => {
  assert(profile);
  assert(relatedScript);

  it("renders header, info items and instances table correctly", async () => {
    const { container } = renderWithProviders(
      <ScriptProfileInfo profile={profile} />,
    );
    await expectLoadingState();

    const fieldsToCheck = [
      { label: "Name", value: profile.title },
      { label: "Status", value: getStatusText(profile) },
      {
        label: "Script",
        value: relatedScript ? relatedScript.title : <NoData />,
      },
      {
        label: "Access group",
        value: relatedAccessGroup,
      },

      {
        label: "Run as user",
        value: profile.username,
      },
      {
        label: "Time limit",
        value: `${profile.time_limit}s`,
      },
      {
        label: "Trigger",
        value: getTriggerLongText(profile) || <NoData />,
      },
      {
        label: "Last run",
        value: profile.activities.last_activity ? (
          moment(profile.activities.last_activity.creation_time)
            .utc()
            .format(DISPLAY_DATE_TIME_FORMAT)
        ) : (
          <NoData />
        ),
      },
      {
        label: "Tags",
        value: profile.all_computers
          ? "All instances"
          : profile.tags.join(", ") || <NoData />,
      },
    ];

    if (profile.trigger.trigger_type !== "event") {
      fieldsToCheck.push({
        label: "Next run",
        value: profile.trigger.next_run ? (
          `${moment(profile.trigger.next_run).utc().format(DISPLAY_DATE_TIME_FORMAT)}`
        ) : (
          <NoData />
        ),
      });
    }

    fieldsToCheck.forEach((field) => {
      expect(container).toHaveInfoItem(field.label, field.value);
    });
  });
});
