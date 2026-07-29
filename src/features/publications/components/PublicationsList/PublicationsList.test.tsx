import { publications } from "@/tests/mocks/publications";
import { publicationTargets } from "@/tests/mocks/publicationTargets";
import { renderWithProviders } from "@/tests/render";
import { screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import PublicationsList from "./PublicationsList";
import { batchGetMirrorNamesWithMissing, mirrors } from "@/tests/mocks/mirrors";
import { batchGetLocalNamesWithMissing } from "@/tests/mocks/localRepositories";
import { NO_DATA_TEXT } from "@/components/layout/NoData";
import { resetLroProgress } from "@/tests/server/handlers/operations";
import type { Publication } from "@canonical/landscape-openapi";

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

  it("renders list columns and row data", async () => {
    resetLroProgress();

    renderWithProviders(
      <PublicationsList
        publications={publications}
        sourceDisplayNames={sourceDisplayNames}
        publicationTargetDisplayNames={publicationTargetDisplayNames}
      />,
    );

    expect(screen.getByRole("columnheader", { name: "name" })).toBeVisible();
    expect(screen.getByRole("columnheader", { name: "status" })).toBeVisible();
    expect(
      screen.getByRole("columnheader", { name: "last published" }),
    ).toBeVisible();
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

    expect(await screen.findByText("Publishing")).toBeInTheDocument();
    expect(screen.getByText("Published")).toBeInTheDocument();
    expect(screen.getByText("Publishing failed")).toBeInTheDocument();

    expect(screen.getByText("Mar 12, 2026, 00:00")).toBeInTheDocument();

    const mirrorsCount = publications.filter((pub) =>
      pub.source.startsWith("mirrors/"),
    ).length;
    const localsCount = publications.filter((pub) =>
      pub.source.startsWith("locals/"),
    ).length;

    expect(screen.getAllByText("Mirror")).toHaveLength(mirrorsCount);
    expect(screen.getAllByText("Local repository")).toHaveLength(localsCount);
    expect(
      screen.getAllByRole("link", {
        name: sourceDisplayNames[publication.source],
      }),
    ).toHaveLength(
      publications.filter((pub) => pub.source === publication.source).length,
    );
    expect(
      screen.getByRole("link", {
        name: publicationTargetDisplayNames[publication.publicationTarget],
      }),
    ).toBeInTheDocument();
  });

  it("renders status cell for no operation as fallback", async () => {
    renderWithProviders(
      <PublicationsList
        publications={[
          {
            ...publication,
            lastOperation: undefined,
            publishTime: undefined,
          },
        ]}
        sourceDisplayNames={sourceDisplayNames}
        publicationTargetDisplayNames={publicationTargetDisplayNames}
      />,
    );

    expect(screen.getByText("Not yet published")).toBeInTheDocument();
    expect(screen.getByText(NO_DATA_TEXT)).toBeInTheDocument();
  });

  it("shows empty message with search query", () => {
    renderWithProviders(
      <PublicationsList
        publications={[]}
        sourceDisplayNames={{}}
        publicationTargetDisplayNames={{}}
      />,
      undefined,
      "/?query=test-publication",
    );

    expect(
      screen.getByText(
        'No publications found with the search: "test-publication"',
      ),
    ).toBeInTheDocument();
  });

  it("does not link unresolved mirror sources", () => {
    const [, missingMirrorSource] = batchGetMirrorNamesWithMissing;
    if (!missingMirrorSource) {
      throw new Error("Missing mirror source fixture");
    }

    const missingMirrorPublication = publications.find(
      (pub) => pub.source === missingMirrorSource,
    );
    if (!missingMirrorPublication) {
      throw new Error("Missing mock publication for non-existent mirror");
    }

    renderWithProviders(
      <PublicationsList
        publications={[missingMirrorPublication]}
        sourceDisplayNames={sourceDisplayNames}
        unreachableSourceNames={[missingMirrorSource]}
        publicationTargetDisplayNames={publicationTargetDisplayNames}
      />,
    );

    expect(screen.getAllByText("Source not found").length).toBeGreaterThan(0);
    expect(
      screen.queryByRole("link", { name: "Source not found" }),
    ).not.toBeInTheDocument();
  });

  it("does not link unresolved local sources", () => {
    const [, missingLocalSource] = batchGetLocalNamesWithMissing;
    if (!missingLocalSource) {
      throw new Error("Missing local source fixture");
    }

    const missingLocalPublication: Publication = {
      name: "publications/missing-local-source-in-list",
      publicationId: "missing-local-source-in-list",
      displayName: "missing local source publication",
      label: "missing-local",
      publicationTarget:
        "publicationTargets/aaaaaaaa-0000-0000-0000-000000000001",
      source: missingLocalSource,
      distribution: "jammy",
      origin: "Canonical",
      architectures: ["amd64"],
      acquireByHash: false,
      butAutomaticUpgrades: false,
      notAutomatic: false,
      multiDist: false,
      skipBz2: false,
      skipContents: false,
      publishTime: new Date("March 12, 2026"),
    };

    renderWithProviders(
      <PublicationsList
        publications={[missingLocalPublication]}
        sourceDisplayNames={{ "locals/aaaa-bbbb-cccc": "Known local" }}
        unreachableSourceNames={[missingLocalSource]}
        publicationTargetDisplayNames={publicationTargetDisplayNames}
      />,
    );

    expect(screen.getAllByText("Source not found").length).toBeGreaterThan(0);
    expect(
      screen.queryByRole("link", { name: "Source not found" }),
    ).not.toBeInTheDocument();
  });
});
