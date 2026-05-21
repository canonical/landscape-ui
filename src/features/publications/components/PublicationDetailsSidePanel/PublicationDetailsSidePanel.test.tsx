import { publications } from "@/tests/mocks/publications";
import { mirrors } from "@/tests/mocks/mirrors";
import { renderWithProviders } from "@/tests/render";
import { screen } from "@testing-library/react";
import { assert, describe, expect, it } from "vitest";
import PublicationDetailsSidePanel from "./PublicationDetailsSidePanel";
import server from "@/tests/server";
import { http } from "msw";
import { API_URL_DEB_ARCHIVE } from "@/constants";

const [publication] = publications;
const publicationId = publication?.publicationId;

const renderPanel = () =>
  renderWithProviders(
    <PublicationDetailsSidePanel />,
    undefined,
    `/?name=${publicationId}`,
  );

describe("PublicationDetailsSidePanel", () => {
  it("shows a loading state while the publication is being fetched", () => {
    const pendingRequest = new Promise<void>((resolve) => {
      void resolve;
    });

    server.use(
      http.get(
        `${API_URL_DEB_ARCHIVE}publications/:publicationName`,
        async () => {
          await pendingRequest;
        },
      ),
    );

    renderPanel();

    expect(screen.getByText("Loading...")).toBeInTheDocument();
  });

  it("renders the publication display name and details once loaded", async () => {
    renderPanel();

    expect(
      await screen.findByRole("heading", { name: publication.displayName }),
    ).toBeInTheDocument();
    expect(
      screen.getByText((publication.architectures ?? []).join(", ")),
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
});
