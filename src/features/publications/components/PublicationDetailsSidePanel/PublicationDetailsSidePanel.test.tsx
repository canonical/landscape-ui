import { publications } from "@/tests/mocks/publications";
import { setEndpointStatus } from "@/tests/controllers/controller";
import { renderWithProviders } from "@/tests/render";
import { screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import PublicationDetailsSidePanel from "./PublicationDetailsSidePanel";

const [publication] = publications;
const publicationId = publication.publicationId!;

const renderPanel = () =>
  renderWithProviders(
    <PublicationDetailsSidePanel />,
    undefined,
    `/?name=${publicationId}`,
  );

describe("PublicationDetailsSidePanel", () => {
  it("shows a loading state while the publication is being fetched", () => {
    setEndpointStatus({ status: "loading", path: "publications" });

    renderPanel();

    expect(screen.getByText("Loading...")).toBeInTheDocument();
  });

  it("renders the publication display name and details once loaded", async () => {
    renderPanel();

    expect(
      await screen.findByRole("heading", { name: publication.displayName }),
    ).toBeInTheDocument();
    expect(
      screen.getByText(publication.architectures!.join(", ")),
    ).toBeInTheDocument();
  });

  it("renders the source name in the details panel", async () => {
    renderPanel();

    await screen.findByRole("heading", { name: publication.displayName });

    expect(screen.getByText("Mirror")).toBeInTheDocument();
  });
});
