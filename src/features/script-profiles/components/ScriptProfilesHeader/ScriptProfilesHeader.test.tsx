import { renderWithProviders } from "@/tests/render";
import { screen } from "@testing-library/react";
import ScriptProfilesHeader from "./ScriptProfilesHeader";
import { describe, it, expect } from "vitest";

describe("ScriptProfilesHeader", () => {
  it("renders header with search and filter components when script profiles data is available", () => {
    renderWithProviders(<ScriptProfilesHeader />);

    expect(screen.getByRole("searchbox")).toBeInTheDocument();
    expect(screen.getByText(/add profile/i)).toBeInTheDocument();
    expect(screen.getByText(/status/i)).toBeInTheDocument();
  });
});
