import { renderWithProviders } from "@/tests/render";
import { screen } from "@testing-library/react";
import { describe, it } from "vitest";
import RepositoryProfileHeader from "./RepositoryProfileHeader";

describe("RepositoryProfileHeader", () => {
  it("renders search input", () => {
    renderWithProviders(<RepositoryProfileHeader />);
    expect(screen.getByRole("searchbox")).toBeInTheDocument();
  });
});
