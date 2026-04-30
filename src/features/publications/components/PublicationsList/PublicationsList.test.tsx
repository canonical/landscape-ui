import { publications } from "@/tests/mocks/publications";
import { publicationTargets } from "@/tests/mocks/publicationTargets";
import { renderWithProviders } from "@/tests/render";
import { screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import PublicationsList from "./PublicationsList";
import { mirrors } from "@/tests/mocks/mirrors";

const buildDisplayNameMaps = (pubs: typeof publications) => {
  const sourceDisplayNames: Record<string, string> = {};
  const publicationTargetDisplayNames: Record<string, string> = {};

  for (const pub of pubs) {
    const mirror = mirrors.find((m) => m.name === pub.source);
    if (mirror?.name) sourceDisplayNames[mirror.name] = mirror.displayName;

    const target = publicationTargets.find(
      (t) => t.name === pub.publicationTarget,
    );
    if (target?.name)
      publicationTargetDisplayNames[target.name] = target.displayName;
  }

  return { sourceDisplayNames, publicationTargetDisplayNames };
};

describe("PublicationsList", () => {
  const [publication] = publications;
  const { sourceDisplayNames, publicationTargetDisplayNames } =
    buildDisplayNameMaps(publications);

  it("renders list columns and row data", () => {
    renderWithProviders(
      <PublicationsList
        publications={publications}
        sourceDisplayNames={sourceDisplayNames}
        publicationTargetDisplayNames={publicationTargetDisplayNames}
      />,
    );

    expect(screen.getByRole("columnheader", { name: "name" })).toBeVisible();
    expect(
      screen.getByRole("columnheader", { name: "source type" }),
    ).toBeVisible();
    expect(screen.getByRole("columnheader", { name: "source" })).toBeVisible();
    expect(
      screen.getByRole("columnheader", { name: "publication target" }),
    ).toBeVisible();

    expect(
      screen.getByRole("button", {
        name: publication.displayName,
      }),
    ).toBeInTheDocument();

    const mirrorsCount = publications.filter((pub) =>
      pub.source.startsWith("mirrors/"),
    ).length;
    const localsCount = publications.filter((pub) =>
      pub.source.startsWith("locals/"),
    ).length;

    expect(screen.getAllByText("Mirror")).toHaveLength(mirrorsCount);
    expect(screen.getAllByText("Local repository")).toHaveLength(localsCount);
    expect(
      screen.getByRole("link", {
        name: sourceDisplayNames[publication.source],
      }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("link", {
        name: publicationTargetDisplayNames[publication.publicationTarget],
      }),
    ).toBeInTheDocument();
  });

  it("shows empty message with search query", () => {
    renderWithProviders(
      <PublicationsList publications={[]} />,
      undefined,
      "/?query=test-publication",
    );

    expect(
      screen.getByText(
        'No publications found with the search: "test-publication"',
      ),
    ).toBeInTheDocument();
  });
});
