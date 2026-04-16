import { renderWithProviders } from "@/tests/render";
import { screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import ViewRepositoryProfileAptSourcesTab from "./ViewRepositoryProfileAptSourcesTab";
import { repositoryProfiles } from "@/tests/mocks/repositoryProfiles";

const [profile, emptyProfile] = repositoryProfiles;

describe("ViewRepositoryProfileAptSourcesTab", () => {
  it("shows loading while apt sources are fetching", () => {
    renderWithProviders(
      <ViewRepositoryProfileAptSourcesTab profile={profile} />,
    );

    expect(screen.getByRole("status")).toBeInTheDocument();
  });

  it("filters profile sources before rendering table", async () => {
    renderWithProviders(
      <ViewRepositoryProfileAptSourcesTab profile={profile} />,
    );

    expect(
      await screen.findByRole("columnheader", { name: "Name" }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("columnheader", { name: "Line" }),
    ).toBeInTheDocument();
    expect(screen.getByRole("cell", { name: "source1" })).toBeInTheDocument();
    expect(screen.getByRole("cell", { name: "source2" })).toBeInTheDocument();
    expect(
      screen.getAllByRole("cell", {
        name: "deb http://example.com/ubuntu focal main",
      }).length,
    ).toEqual(2);

    expect(
      screen.queryByRole("cell", { name: "source3" }),
    ).not.toBeInTheDocument();
    expect(
      screen.queryByRole("cell", { name: "source4" }),
    ).not.toBeInTheDocument();
  });

  it("shows empty message if no sources for the profile", async () => {
    renderWithProviders(
      <ViewRepositoryProfileAptSourcesTab profile={emptyProfile} />,
    );
    expect(
      await screen.findByText("No APT sources found for this profile."),
    ).toBeInTheDocument();
  });
});
