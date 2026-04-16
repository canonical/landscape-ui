import { renderWithProviders } from "@/tests/render";
import { screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it } from "vitest";
import ProfileAssociatedInstancesLink from "./ProfileAssociatedInstancesLink";
import { profiles } from "@/tests/mocks/profiles";
import { NO_DATA_TEXT } from "@/components/layout/NoData";

const [profile] = profiles;

const packageProfile = {
  ...profile,
  all_computers: true,
  constraints: [],
  computers: {
    constrained: [1, 2, 3],
    pending: [],
    "non-compliant": [1, 2],
  },
};

describe("ProfileAssociatedInstancesLink", () => {
  it("renders loading state if isPending is true", () => {
    renderWithProviders(
      <ProfileAssociatedInstancesLink
        count={4}
        profile={profile}
        query="script:1"
        isPending
      />,
    );

    expect(screen.getByRole("status")).toBeInTheDocument();
  });

  it("renders no data when profile has no associations", () => {
    renderWithProviders(
      <ProfileAssociatedInstancesLink
        count={4}
        profile={{ ...profile, tags: [] }}
        query="script:1"
      />,
    );

    expect(screen.getByText(NO_DATA_TEXT)).toBeInTheDocument();
  });

  it("renders no data for post-enrollment script profiles", () => {
    const scriptProfile = {
      ...profile,
      script_id: 123,
      trigger: {
        trigger_type: "event",
        event_type: "post_enrollment",
      },
    };

    renderWithProviders(
      <ProfileAssociatedInstancesLink
        count={4}
        profile={scriptProfile}
        query="script:1"
      />,
    );

    expect(screen.getByText(NO_DATA_TEXT)).toBeInTheDocument();
  });

  it("renders 0 instances text when association count is zero", () => {
    renderWithProviders(
      <ProfileAssociatedInstancesLink
        count={0}
        profile={profile}
        query="script:1"
      />,
    );

    expect(screen.getByText("0 instances")).toBeInTheDocument();
  });

  it("renders link with formatted standard query for general association", () => {
    renderWithProviders(
      <ProfileAssociatedInstancesLink
        count={2}
        profile={profile}
        query="PACKAGE:1"
        isGeneralAssociation
      />,
    );

    expect(screen.getByRole("link", { name: "2 instances" })).toHaveAttribute(
      "href",
      expect.stringContaining("profile%3Apackage%3A1"),
    );
  });

  it("renders link with special query for package noncompliant", () => {
    renderWithProviders(
      <ProfileAssociatedInstancesLink
        count={2}
        profile={packageProfile}
        query="package:1:noncompliant"
      />,
    );

    expect(screen.getByRole("link", { name: "2 instances" })).toHaveAttribute(
      "href",
      expect.stringContaining("id%3A1+OR+id%3A2"),
    );
  });

  it("renders link with special query for package compliant", () => {
    renderWithProviders(
      <ProfileAssociatedInstancesLink
        count={1}
        profile={packageProfile}
        query="package:1:compliant"
      />,
    );

    expect(screen.getByRole("link", { name: "1 instance" })).toHaveAttribute(
      "href",
      expect.stringContaining("id%3A3"),
    );
  });

  it("renders All instances text for profile with all computers in general association", () => {
    renderWithProviders(
      <ProfileAssociatedInstancesLink
        count={2}
        profile={{ ...profile, all_computers: true }}
        query="package:1"
        isGeneralAssociation
      />,
    );

    expect(screen.getByRole("link", { name: "All instances" })).toHaveAttribute(
      "href",
      expect.stringContaining("profile%3Apackage%3A1"),
    );
  });

  it("opens side panel for WSL noncompliant query", async () => {
    const wslProfile = {
      ...profile,
      image_name: "ubuntu-image",
    };

    renderWithProviders(
      <ProfileAssociatedInstancesLink
        count={3}
        profile={wslProfile}
        query="wsl:1:noncompliant"
      />,
    );

    await userEvent.click(screen.getByRole("button", { name: "3 instances" }));

    expect(
      screen.getByText("Instances not compliant with Profile One"),
    ).toBeInTheDocument();
  });
});
