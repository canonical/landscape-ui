import { NO_DATA_TEXT } from "@/components/layout/NoData";
import { expectLoadingState } from "@/tests/helpers";
import { accessGroups } from "@/tests/mocks/accessGroup";
import { wslProfiles } from "@/tests/mocks/wsl-profiles";
import { renderWithProviders } from "@/tests/render";
import { pluralize } from "@/utils/_helpers";
import { screen } from "@testing-library/react";
import WslProfileDetailsSidePanel from "./WslProfileDetailsSidePanel";

describe("WslProfileDetailsSidePanel", () => {
  const testProfile =
    wslProfiles.find((profile) => profile.image_source) ?? wslProfiles[0];

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
      label: "Rootfs image name",
      value: testProfile.image_name,
    },
    {
      label: "Rootfs image source",
      value: testProfile.image_source || NO_DATA_TEXT,
    },
    {
      label: "Cloud-init",
      value: testProfile.cloud_init_contents || NO_DATA_TEXT,
    },
    {
      label: "Associated parents",
      value: `${testProfile.computers.constrained.length} ${pluralize(testProfile.computers.constrained.length, "instance")}`,
    },
    {
      label: "Not compliant",
      value: `${testProfile.computers["non-compliant"].length} ${pluralize(testProfile.computers["non-compliant"].length, "instance")}`,
    },
    {
      label: "Compliant",
      value: `${testProfile.computers.constrained.length - testProfile.computers["non-compliant"].length} ${pluralize(testProfile.computers.constrained.length - testProfile.computers["non-compliant"].length, "instance")}`,
    },
  ];

  it("should render WSL profile details", async () => {
    const { container } = renderWithProviders(
      <WslProfileDetailsSidePanel />,
      undefined,
      `/?wslProfile=${testProfile.name}`,
    );

    await expectLoadingState();

    expect(screen.getByText("Edit")).toBeInTheDocument();
    expect(screen.getByText("Remove")).toBeInTheDocument();

    itemsToCheck.forEach(({ label, value }) => {
      expect(container).toHaveInfoItem(label, value);
    });

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
      expect(container).toHaveInfoItem("tags", testProfile.tags.join(", "));
    }
  });
});
