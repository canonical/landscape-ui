import { expectLoadingState } from "@/tests/helpers";
import { accessGroups } from "@/tests/mocks/accessGroup";
import { upgradeProfiles } from "@/tests/mocks/upgrade-profiles";
import { renderWithProviders } from "@/tests/render";
import { pluralize } from "@/utils/_helpers";
import { screen } from "@testing-library/react";
import { getScheduleInfo } from "./helpers";
import UpgradeProfileDetailsSidePanel from "./UpgradeProfileDetailsSidePanel";

describe("UpgradeProfileDetailsSidePanel", () => {
  const [testProfile] = upgradeProfiles;

  const { scheduleMessage, nextRunMessage } = getScheduleInfo(testProfile);

  const itemsToCheck = [
    {
      label: "Title",
      value: testProfile.title,
    },
    {
      label: "Access group",
      value:
        accessGroups.find(({ name }) => name === testProfile.access_group)
          ?.title ?? testProfile.access_group,
    },
    {
      label: "Upgrade type",
      value: testProfile.upgrade_type === "all" ? "All" : "Security",
    },
    {
      label: "Auto remove packages",
      value: testProfile.autoremove ? "On" : "Off",
    },
    {
      label: "Next run",
      value: nextRunMessage,
    },
    {
      label: "Delivery delay window",
      value: `${testProfile.deliver_delay_window} ${pluralize(Number(testProfile.deliver_delay_window), "minute")}`,
    },
  ];

  it("should render upgrade profile details", async () => {
    const { container } = renderWithProviders(
      <UpgradeProfileDetailsSidePanel />,
      undefined,
      `/?upgradeProfile=${testProfile.id}`,
    );

    await expectLoadingState();

    expect(
      screen.getByLabelText(`Edit upgrade profile ${testProfile.title}`),
    ).toBeInTheDocument();
    expect(
      screen.getByLabelText(`Remove upgrade profile ${testProfile.title}`),
    ).toBeInTheDocument();

    itemsToCheck.forEach(({ label, value }) => {
      expect(container).toHaveInfoItem(label, value);
    });

    expect(
      screen.getByText("Schedule", {
        selector: ".p-text--x-small.u-text--muted",
      }).nextElementSibling,
    ).toHaveTextContent(scheduleMessage);

    if (testProfile.all_computers) {
      expect(
        screen.getByText(
          "This profile has been associated with all instances.",
        ),
      ).toBeInTheDocument();
    } else if (!testProfile.tags.length) {
      expect(
        screen.getByText(
          "This profile has not yet been associated with any instances.",
        ),
      ).toBeInTheDocument();
    } else {
      expect(container).toHaveInfoItem("Tags", testProfile.tags.join(", "));
    }
  });
});
