import { screen } from "@testing-library/react";
import PackageProfileAssociatedInstancesLink from "./PackageProfileAssociatedInstancesLink";
import { packageProfiles } from "@/tests/mocks/package-profiles";
import { NO_DATA_TEXT } from "@/components/layout/NoData";
import { pluralize } from "@/utils/_helpers";
import { renderWithProviders } from "@/tests/render";

const profileWithNoTagsAndNoComputers = packageProfiles.find(
  (p) => !p.tags.length && !p.all_computers,
);

const profileWithNoConstrainedComputers = packageProfiles.find(
  (p) =>
    (p.tags.length || p.all_computers) && p.computers.constrained.length === 0,
);

const profileWithConstrainedComputers = packageProfiles.find(
  (p) => p.computers.constrained.length > 0,
);

assert(
  profileWithNoTagsAndNoComputers &&
    profileWithNoConstrainedComputers &&
    profileWithConstrainedComputers,
);

describe("PackageProfileAssociatedInstancesLink", () => {
  it("renders NoData if no tags and not all_computers", () => {
    renderWithProviders(
      <PackageProfileAssociatedInstancesLink
        packageProfile={profileWithNoTagsAndNoComputers}
      />,
    );
    expect(screen.getByText(NO_DATA_TEXT)).toBeInTheDocument();
  });

  it("renders '0 instances' if computers.constrained is empty", () => {
    renderWithProviders(
      <PackageProfileAssociatedInstancesLink
        packageProfile={profileWithNoConstrainedComputers}
      />,
    );
    expect(screen.getByText("0 instances")).toBeInTheDocument();
  });

  it("renders link with correct count and label", () => {
    renderWithProviders(
      <PackageProfileAssociatedInstancesLink
        packageProfile={profileWithConstrainedComputers}
      />,
    );
    expect(
      screen.getByRole("link", {
        name: `${profileWithConstrainedComputers.computers.constrained.length} ${pluralize(
          profileWithConstrainedComputers.computers.constrained.length,
          "instance",
        )}`,
      }),
    ).toBeInTheDocument();
  });
});
