import { publicationTargetsWithPublications } from "@/tests/mocks/publication-targets";
import { renderWithProviders } from "@/tests/render";
import { screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import PublicationTargetContainer from "./PublicationTargetContainer";

vi.mock("../../api/useGetPublicationTargets", () => ({
  default: vi.fn(),
}));

import useGetPublicationTargets from "../../api/useGetPublicationTargets";

describe("PublicationTargetContainer", () => {
  it("renders the loading state while fetching", () => {
    vi.mocked(useGetPublicationTargets).mockReturnValue({
      publicationTargets: [],
      isGettingPublicationTargets: true,
    });

    renderWithProviders(<PublicationTargetContainer />);

    expect(screen.getByText(/loading/i)).toBeInTheDocument();
  });

  it("renders the empty state when there are no targets", () => {
    vi.mocked(useGetPublicationTargets).mockReturnValue({
      publicationTargets: [],
      isGettingPublicationTargets: false,
    });

    renderWithProviders(<PublicationTargetContainer />);

    expect(
      screen.getByText(/you don't have any publication targets yet/i),
    ).toBeInTheDocument();
  });

  it("renders the Add publication target CTA button in the empty state", () => {
    vi.mocked(useGetPublicationTargets).mockReturnValue({
      publicationTargets: [],
      isGettingPublicationTargets: false,
    });

    renderWithProviders(<PublicationTargetContainer />);

    expect(
      screen.getByRole("button", { name: /add publication target/i }),
    ).toBeInTheDocument();
  });

  it("renders the publication targets list when targets are present", () => {
    vi.mocked(useGetPublicationTargets).mockReturnValue({
      publicationTargets: publicationTargetsWithPublications,
      isGettingPublicationTargets: false,
    });

    renderWithProviders(<PublicationTargetContainer />);

    expect(screen.getByRole("table")).toBeInTheDocument();
  });

  it("does not render the empty state when targets are present", () => {
    vi.mocked(useGetPublicationTargets).mockReturnValue({
      publicationTargets: publicationTargetsWithPublications,
      isGettingPublicationTargets: false,
    });

    renderWithProviders(<PublicationTargetContainer />);

    expect(
      screen.queryByText(/you don't have any publication targets yet/i),
    ).not.toBeInTheDocument();
  });
});
