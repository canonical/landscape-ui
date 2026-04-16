import { screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import RepositoryProfileAddSidePanel from "./RepositoryProfileAddSidePanel";
import { renderWithProviders } from "@/tests/render";

describe("RepositoryProfileAddSidePanel", () => {
  it("renders title and form", () => {
    renderWithProviders(<RepositoryProfileAddSidePanel />);
    expect(
      screen.getByRole("heading", { name: "Add repository profile" }),
    ).toBeInTheDocument();
    expect(screen.getByRole("tab", { name: "Details" })).toBeInTheDocument();
    expect(
      screen.getByRole("tab", { name: "APT sources" }),
    ).toBeInTheDocument();
    expect(screen.getByRole("tab", { name: "Pockets" })).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: "Add a new repository profile" }),
    ).toBeInTheDocument();
  });
});
