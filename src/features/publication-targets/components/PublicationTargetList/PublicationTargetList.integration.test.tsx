import { publicationTargets } from "@/tests/mocks/publicationTargets";
import { renderWithProviders } from "@/tests/render";
import { screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import PublicationTargetList from "./PublicationTargetList";

describe("PublicationTargetList (integration)", () => {
  it("fetches and displays the publications count via useGetPublicationsByTarget", async () => {
    renderWithProviders(<PublicationTargetList targets={publicationTargets} />);

    expect(
      await screen.findByRole("link", { name: /publications/i }),
    ).toBeInTheDocument();
  });
});
