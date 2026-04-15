import { renderWithProviders } from "@/tests/render";
import { screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import ViewScriptProfileDetailsBlock from "./ViewScriptProfileDetailsBlock";
import { useGetSingleScript } from "@/features/scripts";
import { scriptProfiles } from "@/tests/mocks/scriptProfiles";

vi.mock("@/features/scripts", () => ({
  useGetSingleScript: vi.fn(),
}));

const mockUseGetSingleScript = vi.mocked(useGetSingleScript);

const [profile] = scriptProfiles;

describe("ViewScriptProfileDetailsBlock", () => {
  it("renders spinner for script while script details are unavailable", () => {
    mockUseGetSingleScript.mockReturnValue({
      script: undefined,
    } as unknown as ReturnType<typeof useGetSingleScript>);

    renderWithProviders(<ViewScriptProfileDetailsBlock profile={profile} />);

    expect(screen.getByRole("status")).toBeInTheDocument();

    expect(screen.getByText("Run as User")).toBeInTheDocument();
    expect(screen.getByText("root")).toBeInTheDocument();
    expect(screen.getByText("Time limit")).toBeInTheDocument();
    expect(screen.getByText("300s")).toBeInTheDocument();
  });

  it("renders script link when script is resolved", () => {
    mockUseGetSingleScript.mockReturnValue({
      script: { id: 9, title: "Hardening script" },
    } as unknown as ReturnType<typeof useGetSingleScript>);

    renderWithProviders(<ViewScriptProfileDetailsBlock profile={profile} />);

    expect(
      screen.getByRole("link", { name: "Hardening script" }),
    ).toBeInTheDocument();
  });
});
