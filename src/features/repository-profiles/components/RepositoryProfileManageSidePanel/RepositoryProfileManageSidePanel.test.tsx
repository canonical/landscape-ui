import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import RepositoryProfileManageSidePanel from "./RepositoryProfileManageSidePanel";
import useGetPageRepositoryProfile from "../../api/useGetPageRepositoryProfile";

vi.mock("../../api/useGetPageRepositoryProfile", () => ({
  default: vi.fn(),
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

    render(<RepositoryProfileManageSidePanel action="edit" />);
    expect(screen.getByRole("status")).toBeInTheDocument();
  });

  it.each([
    ["edit", "Edit Repo One"],
    ["add", "Add repository profile"],
  ] as const)("renders %s title and form", (action, title) => {
    mockUseGetPageRepositoryProfile.mockReturnValue({
      isGettingRepositoryProfile: false,
      repositoryProfile: { title: "Repo One" },
    } as unknown as ReturnType<typeof useGetPageRepositoryProfile>);

    render(<RepositoryProfileManageSidePanel action={action} />);
    expect(screen.getByText(title)).toBeInTheDocument();
    expect(screen.getByText(`form:${action}`)).toBeInTheDocument();
  });
});
