import { publications } from "@/tests/mocks/publications";
import { mirrors } from "@/tests/mocks/mirrors";
import { renderWithProviders } from "@/tests/render";
import { screen } from "@testing-library/react";
import { assert, describe, expect, it } from "vitest";
import PublicationDetailsSidePanel from "./PublicationDetailsSidePanel";
import { setEndpointStatus } from "@/tests/controllers/controller";

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

  it("keeps showing loading state when fetching the publication fails", async () => {
    setEndpointStatus({ path: "publications", status: "error" });

    renderPanel();

    expect(await screen.findByRole("status")).toBeInTheDocument();
    await expect(
      screen.findByRole(
        "heading",
        { name: publication.displayName },
        {
          timeout: 300,
        },
      ),
    ).rejects.toThrow();
  });
});
