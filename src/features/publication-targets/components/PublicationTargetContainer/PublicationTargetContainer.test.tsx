import { publicationTargetsWithPublications } from "@/tests/mocks/publication-targets";
import { renderWithProviders } from "@/tests/render";
import { screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import PublicationTargetContainer from "./PublicationTargetContainer";

describe("PublicationTargetContainer", () => {
  it("renders the empty state when there are no targets", () => {
    renderWithProviders(<PublicationTargetContainer targets={[]} />);

    expect(
      screen.getByText(/you don't have any publication targets yet/i),
    ).toBeInTheDocument();
  });

  it("renders the Add publication target CTA button in the empty state", () => {
    renderWithProviders(<PublicationTargetContainer targets={[]} />);

    expect(
      screen.getByRole("button", { name: /add publication target/i }),
    ).toBeInTheDocument();
  });

  it("renders the publication targets list when targets are present", () => {
    renderWithProviders(
      <PublicationTargetContainer targets={publicationTargetsWithPublications} />,
    );

    expect(screen.getByRole("table")).toBeInTheDocument();
  });

  it("does not render the empty state when targets are present", () => {
    renderWithProviders(
      <PublicationTargetContainer targets={publicationTargetsWithPublications} />,
    );

    expect(
      screen.queryByText(/you don't have any publication targets yet/i),
    ).not.toBeInTheDocument();
  });
});
