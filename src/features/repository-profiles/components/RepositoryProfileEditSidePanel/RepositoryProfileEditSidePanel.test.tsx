import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import RepositoryProfileEditSidePanel from "./RepositoryProfileEditSidePanel";
import { useGetPageRepositoryProfile } from "../../api/useGetPageRepositoryProfile";

vi.mock("../../api/useGetPageRepositoryProfile", () => ({
  useGetPageRepositoryProfile: vi.fn(),
}));

vi.mock("../RepositoryProfileForm", () => ({
  default: ({ action }: { action: string }) => <div>{`form:${action}`}</div>,
}));

const mockUseGetPageRepositoryProfile = vi.mocked(useGetPageRepositoryProfile);

describe("RepositoryProfileManageSidePanel", () => {
  it("renders loading state while profile is fetching", () => {
    mockUseGetPageRepositoryProfile.mockReturnValue({
      isGettingRepositoryProfile: true,
    } as unknown as ReturnType<typeof useGetPageRepositoryProfile>);

    render(<RepositoryProfileEditSidePanel />);
    expect(screen.getByRole("status")).toBeInTheDocument();
  });

  it("renders title and form", () => {
    mockUseGetPageRepositoryProfile.mockReturnValue({
      isGettingRepositoryProfile: false,
      repositoryProfile: { title: "Repo One" },
    } as unknown as ReturnType<typeof useGetPageRepositoryProfile>);

    render(<RepositoryProfileEditSidePanel />);
    expect(screen.getByText("Edit Repo One")).toBeInTheDocument();
    expect(screen.getByText("form:edit")).toBeInTheDocument();
  });
});
