import { screen } from "@testing-library/react";
import { accessGroups } from "@/tests/mocks/accessGroup";
import { upgradeProfiles } from "@/tests/mocks/upgrade-profiles";
import { renderWithProviders } from "@/tests/render";
import UpgradeProfileDetails from "./UpgradeProfileDetails";
import { getScheduleInfo } from "../UpgradeProfileDetails/helpers";

describe("UpgradeProfileDetails", () => {
  const testProfile = upgradeProfiles[0];

  const { scheduleMessage, nextRunMessage } = getScheduleInfo(testProfile);

  const itemsToCheck = [
    {
      label: "Name",
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
      value: `${testProfile.deliver_delay_window} ${testProfile.deliver_delay_window !== "1" ? "minutes" : "minute"}`,
    },
  ];

  const accessGroupOptions = accessGroups.map(({ name, title }) => ({
    label: title,
    value: name,
  }));

  it("should render upgrade profile details", () => {
    const { container } = renderWithProviders(
      <UpgradeProfileDetails
        profile={testProfile}
        accessGroupOptions={accessGroupOptions}
      />,
    );

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
        selector:
          "p.p-text--small.p-text--small-caps.u-text--muted.u-no-margin--bottom",
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
