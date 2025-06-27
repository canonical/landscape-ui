import { renderWithProviders } from "@/tests/render";
import { screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it } from "vitest";
import RebootProfileDetails from "./RebootProfileDetails";
import { rebootProfiles } from "@/tests/mocks/rebootProfiles";
import { formatWeeklyRebootSchedule } from "./helpers";
import moment from "moment";
import { DISPLAY_DATE_TIME_FORMAT } from "@/constants";
import { accessGroups } from "@/tests/mocks/accessGroup";

const [profile] = rebootProfiles;
const accessGroupOptions = accessGroups.map((group) => ({
  label: group.title,
  value: group.name,
}));

describe("RebootProfileDetails", () => {
  const user = userEvent.setup();

  it("renders all info items correctly", () => {
    const { container } = renderWithProviders(
      <RebootProfileDetails
        profile={profile}
        accessGroupOptions={accessGroupOptions}
      />,
    );
    const accessGroup = accessGroupOptions.find(
      (opt) => opt.value === profile.access_group,
    )?.label;
    assert(accessGroup);

    const fieldsToCheck = [
      {
        label: "Name",
        value: profile.title,
      },
      {
        label: "Access group",
        value: accessGroup,
      },
      {
        label: "schedule",
        value: formatWeeklyRebootSchedule(profile),
      },
      {
        label: "next reboot",
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

  it("opens a modal on remove button click and allows profile removal", async () => {
    renderWithProviders(
      <RebootProfileDetails
        profile={profile}
        accessGroupOptions={accessGroupOptions}
      />,
    );

    await user.click(
      screen.getByRole("button", {
        name: `Remove reboot profile ${profile.title}`,
      }),
    );

    expect(screen.getByText("Remove reboot profile")).toBeInTheDocument();

    const confirmationInput = screen.getByRole("textbox");
    await user.type(confirmationInput, `remove ${profile.title}`);

    const removeButton = screen.getByRole("button", { name: "Remove" });
    expect(removeButton).toBeEnabled();
    await user.click(removeButton);

    expect(
      await screen.findByText("Reboot profile removed"),
    ).toBeInTheDocument();
  });
});
