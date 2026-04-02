import { renderWithProviders } from "@/tests/render";
import { screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { ProfileTypes } from "../../../../helpers";
import AssociatedInstancesCell from "./AssociatedInstancesCell";
import { useGetProfileAssociatedCount } from "../../../../hooks/useGetProfileAssociatedCount";
import { profiles } from "@/tests/mocks/profiles";

vi.mock("../../../../hooks/useGetProfileAssociatedCount", () => ({
  useGetProfileAssociatedCount: vi.fn(),
}));

const mockedUseGetProfileAssociatedCount = vi.mocked(
  useGetProfileAssociatedCount,
);

const [profile] = profiles;

describe("AssociatedInstancesCell", () => {
  it("renders loading while getting associated instances", () => {
    mockedUseGetProfileAssociatedCount.mockReturnValue({
      associatedCount: 7,
      isGettingInstances: true,
    });

    renderWithProviders(
      <AssociatedInstancesCell profile={profile} type={ProfileTypes.script} />,
    );

    expect(screen.getByRole("alert")).toHaveTextContent("Loading");
  });

  it("renders ProfileAssociatedInstancesLink with correct query and count", () => {
    mockedUseGetProfileAssociatedCount.mockReturnValue({
      associatedCount: 7,
      isGettingInstances: false,
    });

    renderWithProviders(
      <AssociatedInstancesCell profile={profile} type={ProfileTypes.script} />,
    );

    expect(screen.getByRole("link", { name: /7 instances/i })).toHaveAttribute(
      "href",
      expect.stringContaining("profile%3Ascript%3A1"),
    );
  });
});
