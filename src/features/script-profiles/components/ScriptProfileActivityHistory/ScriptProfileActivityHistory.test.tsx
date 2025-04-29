import { scriptProfiles } from "@/tests/mocks/scriptProfiles";
import { renderWithProviders } from "@/tests/render";
import { screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import ScriptProfileActivityHistory from "./ScriptProfileActivityHistory";

describe("ScriptProfileActivityHistory", () => {
  it("should show an activity list", async () => {
    renderWithProviders(
      <ScriptProfileActivityHistory profile={scriptProfiles[0]} />,
    );

    expect(await screen.findByText("Run")).toBeInTheDocument();
  });
});
