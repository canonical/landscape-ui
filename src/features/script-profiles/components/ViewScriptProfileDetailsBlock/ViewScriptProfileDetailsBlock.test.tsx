import { renderWithProviders } from "@/tests/render";
import { screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import ViewScriptProfileDetailsBlock from "./ViewScriptProfileDetailsBlock";
import { scriptProfiles } from "@/tests/mocks/scriptProfiles";
import { detailedScriptsData } from "@/tests/mocks/script";

const [profile] = scriptProfiles;

describe("ViewScriptProfileDetailsBlock", () => {
  it("renders spinner for script while script details are unavailable", () => {
    renderWithProviders(
      <ViewScriptProfileDetailsBlock
        profile={{ ...profile, script_id: 999_999 }}
      />,
    );

    expect(screen.getByRole("status")).toBeInTheDocument();

    expect(screen.getByText("Run as User")).toBeInTheDocument();
    expect(screen.getByText("root")).toBeInTheDocument();
    expect(screen.getByText("Time limit")).toBeInTheDocument();
    expect(screen.getByText("300s")).toBeInTheDocument();
  });

  it("renders script link when script is resolved", async () => {
    renderWithProviders(<ViewScriptProfileDetailsBlock profile={profile} />);

    expect(
      await screen.findByRole("link", { name: detailedScriptsData[0].title }),
    ).toBeInTheDocument();
  });
});
