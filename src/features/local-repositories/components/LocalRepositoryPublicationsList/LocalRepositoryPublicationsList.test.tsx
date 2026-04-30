import { renderWithProviders } from "@/tests/render";
import { describe, it, expect } from "vitest";
import LocalRepositoryPublicationsList from "./LocalRepositoryPublicationsList";
import { screen } from "@testing-library/react";
import { publications } from "@/tests/mocks/publications";

const localRepositoriesPublications = publications
  .filter(({ source }) => source.startsWith("locals/"))
  .map((pub) => ({
    ...pub,
    publishTime:
      pub.publishTime instanceof Date
        ? pub.publishTime.toISOString()
        : pub.publishTime,
  }));

describe("LocalRepositoryPublicationsList", () => {
  it("renders table with publication columns", () => {
    renderWithProviders(
      <LocalRepositoryPublicationsList
        publications={localRepositoriesPublications}
      />,
    );

    expect(
      screen.getByRole("columnheader", { name: "Publication" }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("columnheader", { name: "Date published" }),
    ).toBeInTheDocument();
  });

  it("renders publication names as links", () => {
    renderWithProviders(
      <LocalRepositoryPublicationsList
        publications={localRepositoriesPublications}
      />,
    );

    expect(
      screen.getByRole("link", { name: /emea publication/i }),
    ).toBeInTheDocument();
  });

  it("renders publication dates", () => {
    renderWithProviders(
      <LocalRepositoryPublicationsList
        publications={localRepositoriesPublications}
      />,
    );

    const dateElement = screen.getByText(
      new Date("March 12, 2026").toISOString(),
    );
    expect(dateElement).toBeInTheDocument();
  });

  it("renders empty message when no publications", () => {
    renderWithProviders(<LocalRepositoryPublicationsList publications={[]} />);

    expect(
      screen.getByText(
        /no publications associated with this local repository/i,
      ),
    ).toBeInTheDocument();
  });

  it("opens links in same tab by default", () => {
    renderWithProviders(
      <LocalRepositoryPublicationsList
        publications={localRepositoriesPublications}
      />,
    );

    const link = screen.getByRole("link", { name: /emea publication/i });
    expect(link).not.toHaveAttribute("target", "_blank");
  });

  it("opens links in new tab when openNewTab is true", () => {
    renderWithProviders(
      <LocalRepositoryPublicationsList
        publications={localRepositoriesPublications}
        openNewTab={true}
      />,
    );

    const link = screen.getByRole("link", { name: /emea publication/i });
    expect(link).toHaveAttribute("target", "_blank");
    expect(link).toHaveAttribute("rel", "noopener noreferrer");
  });

  it("renders pagination info", () => {
    renderWithProviders(
      <LocalRepositoryPublicationsList
        publications={localRepositoriesPublications}
      />,
    );

    expect(screen.getByText(/showing.*of/i)).toBeInTheDocument();
  });
});
