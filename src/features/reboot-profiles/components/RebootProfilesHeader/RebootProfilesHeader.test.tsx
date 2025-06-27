import { renderWithProviders } from "@/tests/render";
import { screen } from "@testing-library/react";
import { describe, it } from "vitest";
import RebootProfilesHeader from "./RebootProfilesHeader";

describe("RebootProfilesHeader", () => {
  it("renders search box and filter chips area", () => {
    renderWithProviders(<RebootProfilesHeader />);

    expect(screen.getByRole("searchbox")).toBeInTheDocument();
  });
});
