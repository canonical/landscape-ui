import { scriptDetails } from "@/tests/mocks/script";
import { renderWithProviders } from "@/tests/render";
import { screen } from "@testing-library/react";
import { describe, it } from "vitest";
import ScriptCode from "./ScriptCode";

const { code } = scriptDetails;

describe("ScriptCode", () => {
  it("should display code of an active script", async () => {
    renderWithProviders(<ScriptCode code={code} />);

    expect(screen.getByText(/code preview/i)).toBeInTheDocument();
  });
});
