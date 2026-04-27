import { renderWithProviders } from "@/tests/render";
import { screen } from "@testing-library/react";
import { within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { beforeEach, describe, expect, it, vi } from "vitest";
import AddProfileButton from "./AddProfileButton";
import usePageParams from "@/hooks/usePageParams";
import useProfiles from "@/hooks/useProfiles";

vi.mock("@/hooks/usePageParams", () => ({
  default: vi.fn(),
}));

vi.mock("@/hooks/useProfiles", () => ({
  default: vi.fn(),
}));

const mockCreatePageParamsSetter = vi.fn();
const mockUsePageParams = vi.mocked(usePageParams);
const mockUseProfiles = vi.mocked(useProfiles);

describe("AddProfileButton", () => {
  const openAddSidePanel = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
    localStorage.clear();

    mockCreatePageParamsSetter.mockReturnValue(openAddSidePanel);

    mockUsePageParams.mockReturnValue({
      createPageParamsSetter: mockCreatePageParamsSetter,
    } as unknown as ReturnType<typeof usePageParams>);

    mockUseProfiles.mockReturnValue({
      isProfileLimitReached: false,
    } as ReturnType<typeof useProfiles>);
  });

  it("displays specific appearance for scripts header", async () => {
    renderWithProviders(<AddProfileButton isInsideScriptHeader />);

    expect(
      screen.getByRole("button", { name: /add profile/i }),
    ).not.toHaveClass("p-button--positive");
  });

  it("opens add side panel for non-WSL type", async () => {
    renderWithProviders(<AddProfileButton />);

    await userEvent.click(screen.getByRole("button", { name: /add profile/i }));

    expect(openAddSidePanel).toHaveBeenCalledTimes(1);
  });

  it("opens confirmation modal for WSL when not acknowledged", async () => {
    renderWithProviders(<AddProfileButton />, undefined, "/profiles/wsl");

    await userEvent.click(screen.getByRole("button", { name: /add profile/i }));

    expect(
      screen.getByText("WSL profiles is a beta feature"),
    ).toBeInTheDocument();

    const modal = screen.getByRole("dialog");
    await userEvent.click(
      within(modal).getByRole("button", { name: /add WSL profile/i }),
    );

    expect(openAddSidePanel).toHaveBeenCalledTimes(1);
  });

  it("skips modal for WSL when already acknowledged", async () => {
    localStorage.setItem("_landscape_isWslPopupClosed", "true");

    renderWithProviders(<AddProfileButton />, undefined, "/profiles/wsl");

    await userEvent.click(screen.getByRole("button", { name: /add profile/i }));

    expect(openAddSidePanel).toHaveBeenCalledTimes(1);
    expect(
      screen.queryByText("WSL profiles is a beta feature"),
    ).not.toBeInTheDocument();
  });

  it("disables button when profile limit is reached", () => {
    mockUseProfiles.mockReturnValue({
      isProfileLimitReached: true,
    } as ReturnType<typeof useProfiles>);

    renderWithProviders(<AddProfileButton />);

    const button = screen.getByRole("button", { name: /add profile/i });

    expect(button).toHaveClass("p-button--positive");
    expect(button).toHaveAttribute("aria-disabled", "true");
  });
});
