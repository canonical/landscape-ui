import { publications } from "@/tests/mocks/publications";
import { mirrors } from "@/tests/mocks/mirrors";
import { renderWithProviders } from "@/tests/render";
import { screen } from "@testing-library/react";
import { assert, describe, expect, it } from "vitest";
import PublicationDetailsSidePanel from "./PublicationDetailsSidePanel";
import { setEndpointStatus } from "@/tests/controllers/controller";
import { batchGetMirrorNamesWithMissing } from "@/tests/mocks/mirrors";

const [publication] = publications;
assert(publication);
const { publicationId } = publication;
assert(publicationId);

const renderPanel = () =>
  renderWithProviders(
    <PublicationDetailsSidePanel />,
    undefined,
    `/?name=${publicationId}`,
  );

describe("PublicationDetailsSidePanel", () => {
  it("shows a loading state while the publication is being fetched", () => {
    setEndpointStatus({ path: "publications", status: "loading" });

    renderPanel();

    expect(screen.getByRole("status")).toBeInTheDocument();
  });

  it("renders the publication display name and details once loaded", async () => {
    renderPanel();

    expect(
      await screen.findByRole("heading", { name: publication.displayName }),
    ).toBeInTheDocument();
    expect(
      await screen.findByText((publication.architectures ?? []).join(", ")),
    ).toBeInTheDocument();
  });

  it("renders the resolved mirror display name as the source name", async () => {
    const mirrorDisplayName = mirrors.find(
      (m) => m.name === publication?.source,
    )?.displayName;
    assert(mirrorDisplayName);

    renderPanel();

    expect(await screen.findByText(mirrorDisplayName)).toBeInTheDocument();
  });

  it("renders Source not found when publication source is unreachable", async () => {
    const [, missingMirrorSource] = batchGetMirrorNamesWithMissing;
    assert(missingMirrorSource);

    const missingSourcePublication = publications.find(
      (pub) => pub.source === missingMirrorSource,
    );
    assert(missingSourcePublication);

    renderWithProviders(
      <PublicationDetailsSidePanel />,
      undefined,
      `/?name=${missingSourcePublication.publicationId}`,
    );

    expect(await screen.findByText("Source not found")).toBeInTheDocument();
  });
});
