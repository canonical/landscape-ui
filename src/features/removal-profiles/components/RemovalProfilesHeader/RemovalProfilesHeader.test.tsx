import { renderWithProviders } from "@/tests/render";
import { screen } from "@testing-library/react";
import { describe, it } from "vitest";
import RemovalProfilesHeader from "./RemovalProfilesHeader";

describe("RemovalProfilesHeader", () => {
  it("renders search box", () => {
    renderWithProviders(<RemovalProfilesHeader />);
    expect(screen.getByRole("searchbox")).toBeInTheDocument();
  });
});
