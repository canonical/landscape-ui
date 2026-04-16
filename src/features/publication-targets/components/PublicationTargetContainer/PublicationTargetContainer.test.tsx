import { API_URL_DEBARCHIVE } from "@/constants";
import { expectLoadingState } from "@/tests/helpers";
import server from "@/tests/server";
import { renderWithProviders } from "@/tests/render";
import { screen } from "@testing-library/react";
import { http, HttpResponse } from "msw";
import { describe, expect, it, vi } from "vitest";
import PublicationTargetContainer from "./PublicationTargetContainer";

vi.mock("../../api/useGetPublicationsByTarget", () => ({
  default: vi.fn(() => ({ publications: [], isGettingPublications: false })),
}));

describe("PublicationTargetContainer", () => {
  it("renders the loading state while fetching", async () => {
    renderWithProviders(<PublicationTargetContainer />);

    await expectLoadingState();
  });

  it("renders the empty state when there are no targets", async () => {
    server.use(
      http.get(`${API_URL_DEBARCHIVE}v1/publicationTargets`, () =>
        HttpResponse.json({ publicationTargets: [] }),
      ),
    );

    renderWithProviders(<PublicationTargetContainer />);
    await expectLoadingState();

    expect(
      screen.getByText(/you don't have any publication targets yet/i),
    ).toBeInTheDocument();
  });

  it("renders the Add publication target CTA button in the empty state", async () => {
    server.use(
      http.get(`${API_URL_DEBARCHIVE}v1/publicationTargets`, () =>
        HttpResponse.json({ publicationTargets: [] }),
      ),
    );

    renderWithProviders(<PublicationTargetContainer />);
    await expectLoadingState();

    expect(
      screen.getByRole("button", { name: /add publication target/i }),
    ).toBeInTheDocument();
  });

  it("renders the publication targets list when targets are present", async () => {
    renderWithProviders(<PublicationTargetContainer />);
    await expectLoadingState();

    expect(screen.getByRole("table")).toBeInTheDocument();
  });

  it("does not render the empty state when targets are present", async () => {
    renderWithProviders(<PublicationTargetContainer />);
    await expectLoadingState();

    expect(
      screen.queryByText(/you don't have any publication targets yet/i),
    ).not.toBeInTheDocument();
  });
});
