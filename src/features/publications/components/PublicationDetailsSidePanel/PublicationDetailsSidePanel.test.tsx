import { expectLoadingState } from "@/tests/helpers";
import { publications } from "@/tests/mocks/publications";
import { renderWithProviders } from "@/tests/render";
import { screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import PublicationDetailsSidePanel from "./PublicationDetailsSidePanel";

describe("PublicationDetailsSidePanel", () => {
  const [publication] = publications;

  it("shows a loading state while the publication is being fetched", async () => {
    renderWithProviders(
      <PublicationDetailsSidePanel />,
      undefined,
      `/?sidePath=view&publication=${publication.publicationId}`,
    );

    await expectLoadingState();
  });

  it("renders the publication name as a heading when loaded", async () => {
    renderWithProviders(
      <PublicationDetailsSidePanel />,
      undefined,
      `/?sidePath=view&publication=${publication.publicationId}`,
    );

    expect(
      await screen.findByRole("heading", { name: publication.name }),
    ).toBeInTheDocument();
  });

  it("renders publication details content when loaded", async () => {
    renderWithProviders(
      <PublicationDetailsSidePanel />,
      undefined,
      `/?sidePath=view&publication=${publication.publicationId}`,
    );

    expect(await screen.findByText(publication.distribution)).toBeInTheDocument();
  });
});
