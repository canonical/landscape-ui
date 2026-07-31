import { setEndpointStatus } from "@/tests/controllers/controller";
import { publications } from "@/tests/mocks/publications";
import { batchGetLocalNamesWithMissing } from "@/tests/mocks/localRepositories";
import { batchGetMirrorNamesWithMissing } from "@/tests/mocks/mirrors";
import { batchGetPublicationTargetNamesWithMissing } from "@/tests/mocks/publicationTargets";
import server from "@/tests/server";
import { renderWithProviders } from "@/tests/render";
import { screen } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import PublicationsContainer from "./PublicationsContainer";
import { expectLoadingState } from "@/tests/helpers";
import { http, HttpResponse } from "msw";
import { API_URL_DEB_ARCHIVE } from "@/constants";

const debugMock = vi.fn();

vi.mock("@/hooks/useDebug", () => ({
  default: () => debugMock,
}));

describe("PublicationsContainer", () => {
  beforeEach(() => {
    debugMock.mockClear();
  });

  it("renders publications list data", async () => {
    renderWithProviders(<PublicationsContainer />);

    expect(
      await screen.findByRole("button", {
        name: publications[0].displayName,
      }),
    ).toBeInTheDocument();
  });

  it("renders publication target empty state when there are no publication targets", async () => {
    setEndpointStatus({ status: "empty", path: "publicationTargets" });

    renderWithProviders(<PublicationsContainer />);

    expect(
      await screen.findByText(
        /you must first add a publication target in order to add a publication/i,
      ),
    ).toBeInTheDocument();
  });

  it("renders publication empty state when there are no publications", async () => {
    setEndpointStatus({ status: "empty", path: "publications" });

    renderWithProviders(<PublicationsContainer />);

    expect(
      await screen.findByText(/you don.t have any publications yet/i),
    ).toBeInTheDocument();
  });

  it("does not render button to add publication when there are no publication targets", async () => {
    setEndpointStatus({ status: "empty", path: "publicationTargets" });

    renderWithProviders(<PublicationsContainer />);
    await expectLoadingState();

    expect(
      screen.queryByRole("button", { name: "Add publication" }),
    ).not.toBeInTheDocument();
  });

  it("filters publications by publicationTargetId: prefix", async () => {
    const targetId = "aaaaaaaa-0000-0000-0000-000000000001";

    renderWithProviders(
      <PublicationsContainer />,
      undefined,
      `/?query=publicationTargetId:${targetId}`,
    );

    expect(
      await screen.findByRole("button", { name: publications[0].displayName }),
    ).toBeInTheDocument();
    expect(
      screen.queryByRole("button", { name: publications[1].displayName }),
    ).not.toBeInTheDocument();
  });

  it("filters publications by source: prefix", async () => {
    renderWithProviders(
      <PublicationsContainer />,
      undefined,
      "/?query=source:mirrors/ubuntu-archive-mirror",
    );

    expect(
      await screen.findByRole("button", { name: publications[0].displayName }),
    ).toBeInTheDocument();
    expect(
      screen.queryByRole("button", { name: publications[1].displayName }),
    ).not.toBeInTheDocument();
  });

  it("filters publications by plain display name", async () => {
    renderWithProviders(<PublicationsContainer />, undefined, "/?query=jammy");

    expect(
      await screen.findByRole("button", { name: publications[0].displayName }),
    ).toBeInTheDocument();
    expect(
      screen.queryByRole("button", { name: publications[1].displayName }),
    ).not.toBeInTheDocument();
  });

  it("handles batchGet response with nameless mirror entries", async () => {
    server.use(
      http.post(`${API_URL_DEB_ARCHIVE}mirrors:batchGet`, () =>
        HttpResponse.json({ mirrors: [{ displayName: "no-name-mirror" }] }),
      ),
    );

    renderWithProviders(<PublicationsContainer />);

    await expectLoadingState();

    expect(
      await screen.findByRole("button", {
        name: publications[0].displayName,
      }),
    ).toBeInTheDocument();
  });

  it("handles batchGet response with no mirrors field", async () => {
    server.use(
      http.post(`${API_URL_DEB_ARCHIVE}mirrors:batchGet`, () =>
        HttpResponse.json({}),
      ),
    );

    renderWithProviders(<PublicationsContainer />);

    await expectLoadingState();

    expect(
      await screen.findByRole("button", {
        name: publications[0].displayName,
      }),
    ).toBeInTheDocument();
  });

  it("renders status for unreachable mirrors, locals, and publication targets", async () => {
    const [, missingMirrorSource] = batchGetMirrorNamesWithMissing;
    const [, missingLocalSource] = batchGetLocalNamesWithMissing;
    const [, missingPublicationTarget] =
      batchGetPublicationTargetNamesWithMissing;
    if (
      !missingMirrorSource ||
      !missingLocalSource ||
      !missingPublicationTarget
    ) {
      throw new Error("Missing batchGet missing-source fixtures");
    }

    server.use(
      http.post(`${API_URL_DEB_ARCHIVE}mirrors:batchGet`, () =>
        HttpResponse.json({
          mirrors: [
            {
              name: "mirrors/ubuntu-archive-mirror",
              displayName: "Ubuntu archive mirror",
            },
          ],
          unreachable: [missingMirrorSource],
        }),
      ),
      http.post(`${API_URL_DEB_ARCHIVE}locals:batchGet`, () =>
        HttpResponse.json({
          locals: [
            {
              name: "locals/aaaa-bbbb-cccc",
              displayName: "Local with no description",
            },
          ],
          unreachable: [missingLocalSource],
        }),
      ),
      http.post(`${API_URL_DEB_ARCHIVE}publicationTargets:batchGet`, () =>
        HttpResponse.json({
          publicationTargets: [
            {
              name: "publicationTargets/aaaaaaaa-0000-0000-0000-000000000001",
              displayName: "prod-s3-us-east",
            },
          ],
          unreachable: [missingPublicationTarget],
        }),
      ),
    );

    renderWithProviders(<PublicationsContainer />);

    expect(
      await screen.findByRole("button", {
        name: publications[0].displayName,
      }),
    ).toBeInTheDocument();
  });
});
