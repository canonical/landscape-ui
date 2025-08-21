import { DISPLAY_DATE_TIME_FORMAT } from "@/constants";
import usePageParams from "@/hooks/usePageParams";
import { expectLoadingState } from "@/tests/helpers";
import { accessGroups } from "@/tests/mocks/accessGroup";
import { rebootProfiles } from "@/tests/mocks/rebootProfiles";
import { renderWithProviders } from "@/tests/render";
import { screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import moment from "moment";
import type { FC } from "react";
import { describe, expect, it } from "vitest";
import RebootProfileDetailsSidePanel from "./RebootProfileDetailsSidePanel";
import { formatWeeklyRebootSchedule } from "./helpers";

const [profile] = rebootProfiles;
const accessGroupOptions = accessGroups.map((group) => ({
  label: group.title,
  value: group.name,
}));

const RebootProfileDetailsSidePanelTestWrapper: FC = () => {
  const { lastSidePathSegment } = usePageParams();

  if (lastSidePathSegment === "view") {
    return <RebootProfileDetailsSidePanel />;
  }

  return null;
};

describe("RebootProfileDetailsSidePanel", () => {
  const user = userEvent.setup();

  it("renders all info items correctly", async () => {
    const { container } = renderWithProviders(
      <RebootProfileDetailsSidePanel />,
      undefined,
      `/?rebootProfile=${profile.id}`,
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

  it("opens a modal on remove button click and allows profile removal", async () => {
    renderWithProviders(
      <RebootProfileDetailsSidePanelTestWrapper />,
      undefined,
      `/?sidePath=view&rebootProfile=${profile.id}`,
    );

    await expectLoadingState();

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
