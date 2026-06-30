import { renderWithProviders } from "@/tests/render";
import { describe, it, expect } from "vitest";
import AssociatedPublicationsCount from "./AssociatedPublicationsCount";
import { repositories } from "@/tests/mocks/localRepositories";
import { screen } from "@testing-library/react";

describe("AssociatedPublicationsCount", () => {
  it("renders loading state while fetching publications", () => {
    renderWithProviders(
      <AssociatedPublicationsCount sourceName={repositories[0].name} />,
    );

    expect(screen.getByRole("status")).toBeInTheDocument();
  });

  it("renders publication count as link when loaded", async () => {
    renderWithProviders(
      <AssociatedPublicationsCount sourceName={repositories[0].name} />,
    );

    expect(await screen.findByRole("link")).toHaveAttribute(
      "href",
      expect.stringContaining(encodeURIComponent(repositories[0].name)),
    );
    expect(screen.getByText(/1 publication/i)).toBeInTheDocument();
  });

  it("renders zero publications text", async () => {
    renderWithProviders(
      <AssociatedPublicationsCount sourceName={repositories[2].name} />,
    );

    expect(await screen.findByText(/0 publications/i)).toBeInTheDocument();
    expect(screen.queryByRole("link")).not.toBeInTheDocument();
  });
});
