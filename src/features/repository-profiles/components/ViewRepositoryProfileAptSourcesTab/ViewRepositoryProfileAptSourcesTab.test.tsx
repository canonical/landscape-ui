import { renderWithProviders } from "@/tests/render";
import { screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import ViewRepositoryProfileAptSourcesTab from "./ViewRepositoryProfileAptSourcesTab";
import { useGetAPTSources } from "@/features/apt-sources";
import { repositoryProfiles } from "@/tests/mocks/repositoryProfiles";

vi.mock("@/features/apt-sources", () => ({
  useGetAPTSources: vi.fn(),
}));

const [profile] = repositoryProfiles;

const mockUseGetAPTSources = vi.mocked(useGetAPTSources);

describe("ViewRepositoryProfileAptSourcesTab", () => {
  it("shows loading while apt sources are fetching", () => {
    mockUseGetAPTSources.mockReturnValue({
      aptSources: [],
      isGettingAPTSources: true,
    } as unknown as ReturnType<typeof useGetAPTSources>);

    renderWithProviders(
      <ViewRepositoryProfileAptSourcesTab profile={profile} />,
    );

    expect(screen.getByRole("status")).toBeInTheDocument();
  });

  it("filters profile sources before rendering table", () => {
    mockUseGetAPTSources.mockReturnValue({
      isGettingAPTSources: false,
      aptSources: [
        { name: "A", line: "line-a", profiles: ["repo-profile-1"] },
        { name: "B", line: "line-b", profiles: ["repo-profile-2"] },
      ],
    } as unknown as ReturnType<typeof useGetAPTSources>);

    renderWithProviders(
      <ViewRepositoryProfileAptSourcesTab profile={profile} />,
    );

    expect(
      screen.getByRole("columnheader", { name: "Name" }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("columnheader", { name: "Line" }),
    ).toBeInTheDocument();
    expect(screen.getByRole("cell", { name: "A" })).toBeInTheDocument();
    expect(screen.getByRole("cell", { name: "line-a" })).toBeInTheDocument();

    expect(screen.queryByRole("cell", { name: "B" })).not.toBeInTheDocument();
    expect(
      screen.queryByRole("cell", { name: "line-b" }),
    ).not.toBeInTheDocument();
  });

  it("shows empty message if no sources for the profile", () => {
    mockUseGetAPTSources.mockReturnValue({
      isGettingAPTSources: false,
      aptSources: [{ name: "B", line: "line-b", profiles: ["repo-profile-2"] }],
    } as unknown as ReturnType<typeof useGetAPTSources>);

    renderWithProviders(
      <ViewRepositoryProfileAptSourcesTab profile={profile} />,
    );
    expect(
      screen.getByText("No APT sources found for this profile."),
    ).toBeInTheDocument();
  });
});
