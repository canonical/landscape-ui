import { renderWithProviders } from "@/tests/render";
import { screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import ViewProfileAssociationBlock from "./ViewProfileAssociationBlock";
import type { Profile } from "../../../../types";
import { ProfileTypes } from "../../../../helpers";
import { useGetProfileAssociatedCount } from "../../../../hooks/useGetProfileAssociatedCount";

vi.mock("../../../../hooks/useGetProfileAssociatedCount", () => ({
  useGetProfileAssociatedCount: vi.fn(),
}));

const mockedUseGetProfileAssociatedCount = vi.mocked(
  useGetProfileAssociatedCount,
);

const profile: Profile = {
  access_group: "global",
  all_computers: false,
  description: "description",
  id: 12,
  name: "profile-3",
  tags: ["tag1", "tag2"],
  title: "Profile Three",
};

describe("ViewProfileAssociationBlock", () => {
  it("shows no associations message", () => {
    mockedUseGetProfileAssociatedCount.mockReturnValue({
      associatedCount: 0,
      isGettingInstances: false,
    });

    renderWithProviders(
      <ViewProfileAssociationBlock
        profile={{ ...profile, tags: [] }}
        type={ProfileTypes.script}
      />,
    );

    expect(screen.getByText("Association")).toBeInTheDocument();
    expect(screen.getByText("Associated Instances")).toBeInTheDocument();
    expect(
      screen.getByText(
        /This profile has not yet been associated with any instances/i,
      ),
    ).toBeInTheDocument();

    expect(screen.queryByText("Compliant")).not.toBeInTheDocument();
    expect(screen.queryByText("Not Compliant")).not.toBeInTheDocument();
    expect(screen.queryByText("Tags")).not.toBeInTheDocument();
  });

  it("renders tags when profile has them", () => {
    mockedUseGetProfileAssociatedCount.mockReturnValue({
      associatedCount: 6,
      isGettingInstances: false,
    });

    renderWithProviders(
      <ViewProfileAssociationBlock
        profile={profile}
        type={ProfileTypes.package}
      />,
    );

    expect(screen.getByText("Tags")).toBeInTheDocument();
    expect(screen.getByText("tag1")).toBeInTheDocument();
    expect(screen.getByText("tag2")).toBeInTheDocument();
  });

  it("renders compliance links when profile has compliance data", () => {
    mockedUseGetProfileAssociatedCount.mockReturnValue({
      associatedCount: 3,
      isGettingInstances: false,
    });

    const packageProfile = {
      ...profile,
      constraints: [],
      computers: {
        constrained: [1, 2, 3],
        "non-compliant": [2],
        pending: [],
      },
    };

    renderWithProviders(
      <ViewProfileAssociationBlock
        profile={packageProfile}
        type={ProfileTypes.package}
      />,
    );

    expect(screen.getByRole("link", { name: /3 instances/i })).toHaveAttribute(
      "href",
      expect.stringContaining("profile%3Apackage%3A12"),
    );
    expect(screen.getByText("Compliant")).toBeInTheDocument();
    expect(screen.getByText("Not compliant")).toBeInTheDocument();
    expect(screen.getByRole("link", { name: /2 instances/i })).toHaveAttribute(
      "href",
      expect.stringContaining("id%3A1+OR+id%3A3"),
    );
    expect(screen.getByRole("link", { name: /1 instance/i })).toHaveAttribute(
      "href",
      expect.stringContaining("id%3A2"),
    );
  });
});
