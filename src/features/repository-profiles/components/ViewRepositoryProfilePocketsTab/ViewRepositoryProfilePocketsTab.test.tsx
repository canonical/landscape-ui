import { renderWithProviders } from "@/tests/render";
import { screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import ViewRepositoryProfilePocketsTab from "./ViewRepositoryProfilePocketsTab";
import { getDistributions } from "../../helpers";
import { repositoryProfiles } from "@/tests/mocks/repositoryProfiles";
import type { Distribution } from "@/features/mirrors";

vi.mock("../../helpers", () => ({
  getDistributions: vi.fn(),
}));

const mockGetDistributions = vi.mocked(getDistributions);

const [profile] = repositoryProfiles;

describe("ViewRepositoryProfilePocketsTab", () => {
  it("shows empty message when no pockets exist", () => {
    mockGetDistributions.mockReturnValue([]);

    renderWithProviders(
      <ViewRepositoryProfilePocketsTab profile={{ ...profile }} />,
    );

    expect(
      screen.getByText("No pockets found for this profile."),
    ).toBeInTheDocument();
  });

  it("renders distribution rows when pockets exist", () => {
    mockGetDistributions.mockReturnValue([
      {
        name: "Ubuntu",
        series: [
          { name: "lucid", pockets: [{ name: "updates" }, { name: "security" }] },
          { name: "noble", pockets: [{ name: "release" }] },
        ],
      },
    ] as unknown as Distribution[]);

    renderWithProviders(
      <ViewRepositoryProfilePocketsTab profile={profile} />,
    );

    expect(screen.getByText("Distribution")).toBeInTheDocument();
    expect(screen.getByText("Series")).toBeInTheDocument();
    expect(screen.getByText("Pocket")).toBeInTheDocument();

    expect(screen.getByText("Ubuntu")).toBeInTheDocument();
    expect(screen.getByText("lucid")).toBeInTheDocument();
    expect(screen.getByText("updates, security")).toBeInTheDocument();
    expect(screen.getByText("noble")).toBeInTheDocument();
    expect(screen.getByText("release")).toBeInTheDocument();
  });
});
