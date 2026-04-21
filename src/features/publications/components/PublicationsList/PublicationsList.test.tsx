import { publicationTargets, publications } from "@/tests/mocks/publications";
import { renderWithProviders } from "@/tests/render";
import { screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
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
  const user = userEvent.setup();
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
        name: publication.label,
      }),
    ).toBeInTheDocument();
    expect(screen.getAllByText("Mirror")).toHaveLength(publications.length);
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
    expect(screen.getByText(publication.distribution)).toBeInTheDocument();
    expect(screen.getByText(publication.component)).toBeInTheDocument();
  });

  it("opens sidepanel when clicking a publication name", async () => {
    renderWithProviders(
      <PublicationsList
        publications={publications}
        sourceDisplayNames={sourceDisplayNames}
        publicationTargetDisplayNames={publicationTargetDisplayNames}
      />,
    );
    const publicationLabel = publication.label;

    await user.click(screen.getByRole("button", { name: publicationLabel }));

    const sidePanel = screen.getByRole("complementary");
    expect(sidePanel).toBeInTheDocument();
    expect(
      within(sidePanel).getByRole("heading", { name: publicationLabel }),
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
