import { DISPLAY_DATE_TIME_FORMAT } from "@/constants";
import { expectLoadingState } from "@/tests/helpers";
import { accessGroups } from "@/tests/mocks/accessGroup";
import { rebootProfiles } from "@/tests/mocks/rebootProfiles";
import { renderWithProviders } from "@/tests/render";
import moment from "moment";
import { describe, expect, it } from "vitest";
import RebootProfileDetailsSidePanel from "./RebootProfileDetailsSidePanel";
import { formatWeeklyRebootSchedule } from "./helpers";

const [profile] = rebootProfiles;
const accessGroupOptions = accessGroups.map((group) => ({
  label: group.title,
  value: group.name,
}));

describe("RebootProfileDetailsSidePanel", () => {
  afterEach(() => {
    vi.clearAllMocks();
  });

  it("renders all info items correctly", async () => {
    const { container } = renderWithProviders(
      <RebootProfileDetailsSidePanel />,
      undefined,
      `/?profile=${profile.id}`,
    );

    await expectLoadingState();

    const accessGroup = accessGroupOptions.find(
      (opt) => opt.value === profile.access_group,
    )?.label;
    assert(accessGroup);

    const fieldsToCheck = [
      {
        label: "Title",
        value: profile.title,
      },
      {
        label: "Access group",
        value: accessGroup,
      },
      {
        label: "Schedule",
        value: formatWeeklyRebootSchedule(profile),
      },
      {
        label: "Next reboot",
        value: moment(profile.next_run).format(DISPLAY_DATE_TIME_FORMAT),
      },
      {
        label: "Tags",
        value: profile.tags.join(", "),
      },
    ];

    fieldsToCheck.forEach((field) => {
      expect(container).toHaveInfoItem(field.label, field.value);
    });
  });
});
