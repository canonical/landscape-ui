import { NO_DATA_TEXT } from "@/components/layout/NoData";
import { rebootProfiles } from "@/tests/mocks/rebootProfiles";
import { renderWithProviders } from "@/tests/render";
import { pluralize } from "@/utils/_helpers";
import { screen } from "@testing-library/react";
import { describe, it } from "vitest";
import RebootProfileAssociatedInstancesLink from "./RebootProfileAssociatedInstancesLink";

const profileWithNoTags = rebootProfiles.find(
  (p) => !p.tags.length && !p.all_computers,
);
const profileWithZeroInstances = rebootProfiles.find(
  (p) => p.num_computers === 0 && (p.tags.length || p.all_computers),
);
const validProfile = rebootProfiles.find(
  (p) => p.tags.length && p.num_computers > 0,
);

assert(profileWithNoTags && profileWithZeroInstances && validProfile);

describe("RebootProfileAssociatedInstancesLink", () => {
  it("shows 'no data component' when no tags and not all computers", () => {
    renderWithProviders(
      <RebootProfileAssociatedInstancesLink
        rebootProfile={profileWithNoTags}
      />,
    );

    expect(screen.getByText(NO_DATA_TEXT)).toBeInTheDocument();
  });

  it("shows '0 instances' when num_computers is zero", () => {
    renderWithProviders(
      <RebootProfileAssociatedInstancesLink
        rebootProfile={profileWithZeroInstances}
      />,
    );

    expect(screen.getByText("0 instances")).toBeInTheDocument();
  });

  it("renders a link with the number of instances when data is valid", () => {
    renderWithProviders(
      <RebootProfileAssociatedInstancesLink rebootProfile={validProfile} />,
    );

    expect(
      screen.getByRole("link", {
        name: `${validProfile.num_computers} ${pluralize(
          validProfile.num_computers,
          "instance",
        )}`,
      }),
    ).toBeInTheDocument();
  });
});
