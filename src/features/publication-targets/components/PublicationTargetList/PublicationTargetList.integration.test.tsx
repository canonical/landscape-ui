import { publicationTargets } from "@/tests/mocks/publicationTargets";
import { publications } from "@/tests/mocks/publications";
import { renderWithProviders } from "@/tests/render";
import { screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import PublicationTargetList from "./PublicationTargetList";

describe("PublicationTargetList (integration)", () => {
  it("fetches and displays the publications count via useGetPublicationsByTarget", async () => {
    renderWithProviders(<PublicationTargetList targets={publicationTargets} />);

    // Each row independently fetches publications (with a delay in MSW). If we
    // only await the first link, the other in-flight requests outlive the test
    // and trip MSW's `onUnhandledRequest: "error"` after `resetHandlers()`.
    // Wait until *every* cell has settled by counting the links for targets
    // that have publications.
    const targetIdsWithPublications = new Set(
      publications
        .map(({ publicationTarget }) =>
          publicationTarget?.replace(/^publicationTargets\//, ""),
        )
        .filter((id): id is string => Boolean(id)),
    );
    const expectedLinkCount = publicationTargets.filter(
      ({ publicationTargetId }) =>
        publicationTargetId &&
        targetIdsWithPublications.has(publicationTargetId),
    ).length;

    await vi.waitFor(() => {
      expect(
        screen.getAllByRole("link", { name: /publication/i }),
      ).toHaveLength(expectedLinkCount);
    });
  });
});
