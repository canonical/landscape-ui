import { screen } from "@testing-library/react";
import { accessGroups } from "@/tests/mocks/accessGroup";
import { renderWithProviders } from "@/tests/render";
import WslProfileDetails from "./WslProfileDetails";
import { wslProfiles } from "@/tests/mocks/wsl-profiles";

describe("WslProfileDetails", () => {
  const testProfile =
    wslProfiles.find((profile) => profile.image_source) ?? wslProfiles[0];

  const itemsToCheck = [
    {
      label: "name",
      value: testProfile.title,
    },
    {
      label: "access group",
      value:
        accessGroups.find(({ name }) => name === testProfile.access_group)
          ?.title ?? testProfile.access_group,
    },
    {
      label: "rootfs image name",
      value: testProfile.image_name,
    },
    {
      label: "rootfs image source",
      value: testProfile.image_source || "N/A",
    },
    {
      label: "cloud init",
      value: testProfile.cloud_init_contents || "N/A",
    },
    {
      label: "associated",
      value: `${testProfile.computers.constrained.length} instances`,
    },
    {
      label: "not compliant",
      value: `${testProfile.computers["non-compliant"].length} instances`,
    },
    {
      label: "pending",
      value: `${testProfile.computers.pending?.length ?? 0} instances`,
    },
  ];

  const accessGroupOptions = accessGroups.map(({ name, title }) => ({
    label: title,
    value: name,
  }));

  it("should render WSL profile details", () => {
    const { container } = renderWithProviders(
      <WslProfileDetails
        profile={testProfile}
        accessGroupOptions={accessGroupOptions}
      />,
    );

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
