import { renderWithProviders } from "@/tests/render";
import { screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import ViewProfileGeneralBlock from "./ViewProfileGeneralBlock";
import { ProfileTypes } from "../../../../helpers";
import useRoles from "@/hooks/useRoles";
import { profiles } from "@/tests/mocks/profiles";

vi.mock("@/hooks/useRoles", () => ({
  default: vi.fn(),
}));

vi.mock("@/utils/_helpers", () => ({
  getTitleByName: () => "Global Access Group",
}));

const mockUseRoles = vi.mocked(useRoles);

const [baseProfile] = profiles;

describe("ViewProfileGeneralBlock", () => {
  beforeEach(() => {
    mockUseRoles.mockReturnValue({
      getAccessGroupQuery: () => ({ data: {}, isPending: false }),
    } as unknown as ReturnType<typeof useRoles>);
  });

  it("shows loading state while access groups are loading", () => {
    mockUseRoles.mockReturnValue({
      getAccessGroupQuery: () => ({ data: undefined, isPending: true }),
    } as unknown as ReturnType<typeof useRoles>);

    renderWithProviders(
      <ViewProfileGeneralBlock
        profile={baseProfile}
        type={ProfileTypes.script}
      />,
    );

    expect(screen.getByRole("status")).toBeInTheDocument();
  });

  it.each([
    [ProfileTypes.reboot],
    [ProfileTypes.upgrade],
    [ProfileTypes.removal],
  ])("renders no status nor description for %s profile", async (type) => {
    renderWithProviders(
      <ViewProfileGeneralBlock profile={baseProfile} type={type} />,
    );

    expect(
      await screen.findByRole("heading", { name: /^General$/i }),
    ).toBeInTheDocument();
    expect(screen.getByText(/^Name$/i)).toBeInTheDocument();
    expect(screen.getByText(baseProfile.title)).toBeInTheDocument();
    expect(screen.getByText(/^Access group$/i)).toBeInTheDocument();
    expect(screen.getByText("Global Access Group")).toBeInTheDocument();

    expect(screen.queryByText(/^Status$/i)).not.toBeInTheDocument();
    expect(screen.queryByText(/^Description$/i)).not.toBeInTheDocument();
  });

  it.each([[ProfileTypes.script], [ProfileTypes.security]])(
    "renders active status for %s profile",
    async (type) => {
      renderWithProviders(
        <ViewProfileGeneralBlock profile={baseProfile} type={type} />,
      );

      expect(
        await screen.findByRole("heading", { name: /^General$/i }),
      ).toBeInTheDocument();
      expect(screen.getByText(/^Name$/i)).toBeInTheDocument();
      expect(screen.getByText(/^Access group$/i)).toBeInTheDocument();

      expect(screen.getByText(/^Status$/i)).toBeInTheDocument();
      expect(screen.getByText("Active")).toBeInTheDocument();

      expect(screen.queryByText(/^Description$/i)).not.toBeInTheDocument();
    },
  );

  it.each([
    [ProfileTypes.script, { ...baseProfile, archived: true }],
    [ProfileTypes.security, { ...baseProfile, status: "archived" }],
  ])("renders archived status for %s profile", async (type, profile) => {
    renderWithProviders(
      <ViewProfileGeneralBlock profile={profile} type={type} />,
    );

    expect(await screen.findByText("Archived")).toBeInTheDocument();
  });

  it.each([
    [ProfileTypes.package],
    [ProfileTypes.repository],
    [ProfileTypes.wsl],
  ])("renders description for %s profile", async (type) => {
    renderWithProviders(
      <ViewProfileGeneralBlock profile={baseProfile} type={type} />,
    );

    expect(
      await screen.findByRole("heading", { name: /^General$/i }),
    ).toBeInTheDocument();
    expect(screen.getByText(/^Name$/i)).toBeInTheDocument();
    expect(screen.getByText(/^Access group$/i)).toBeInTheDocument();

    expect(screen.getByText(/^Description$/i)).toBeInTheDocument();
    expect(screen.getByText(baseProfile.description)).toBeInTheDocument();

    expect(screen.queryByText(/^Status$/i)).not.toBeInTheDocument();
  });
});
