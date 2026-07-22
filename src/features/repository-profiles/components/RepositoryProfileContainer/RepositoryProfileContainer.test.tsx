import { API_URL } from "@/constants";
import { setEndpointStatus } from "@/tests/controllers/controller";
import { expectLoadingState } from "@/tests/helpers";
import { repositoryProfiles } from "@/tests/mocks/repositoryProfiles";
import { renderWithProviders } from "@/tests/render";
import server from "@/tests/server";
import type { ApiPaginatedResponse } from "@/types/api/ApiPaginatedResponse";
import type { UseQueryResult } from "@tanstack/react-query";
import { screen } from "@testing-library/react";
import type { AxiosResponse } from "axios";
import { http, HttpResponse } from "msw";
import { beforeEach, describe, expect, it, vi } from "vitest";
import type { RepositoryProfile } from "../../types";
import RepositoryProfileContainer from "./RepositoryProfileContainer";
import { MANAGE_REPOSITORIES_DOCUMENTATION_URL } from "./constants";

type UnfilteredResult = UseQueryResult<
  AxiosResponse<ApiPaginatedResponse<RepositoryProfile>>
> & { isPending: false };

const makeUnfilteredResult = (
  count: number,
  override?: { data?: undefined; error: Error },
): UnfilteredResult => {
  if (override && override.data === undefined) {
    return {
      data: undefined,
      error: override.error,
      isPending: false,
    } as unknown as UnfilteredResult;
  }

  return {
    data: {
      data: {
        count,
        results: repositoryProfiles.slice(0, count),
        next: null,
        previous: null,
      },
      status: 200,
      statusText: "OK",
      headers: {},
      config: {} as AxiosResponse["config"],
    } as AxiosResponse<ApiPaginatedResponse<RepositoryProfile>>,
    error: null,
    isPending: false,
  } as unknown as UnfilteredResult;
};

describe("RepositoryProfileContainer", () => {
  it("renders the profile list and header when profiles exist", async () => {
    renderWithProviders(
      <RepositoryProfileContainer
        unfilteredRepositoryProfilesResult={makeUnfilteredResult(
          repositoryProfiles.length,
        )}
      />,
    );

    await expectLoadingState();

    expect(screen.getByRole("table")).toBeInTheDocument();
    expect(screen.getByText(repositoryProfiles[0].title)).toBeInTheDocument();
  });

  it("renders loading state while filtered profiles are pending", async () => {
    renderWithProviders(
      <RepositoryProfileContainer
        unfilteredRepositoryProfilesResult={makeUnfilteredResult(
          repositoryProfiles.length,
        )}
      />,
    );

    await expectLoadingState();
  });

  it("renders empty state when unfiltered count is zero", async () => {
    setEndpointStatus("empty");
    renderWithProviders(
      <RepositoryProfileContainer
        unfilteredRepositoryProfilesResult={makeUnfilteredResult(0)}
      />,
      undefined,
    );

    expect(
      await screen.findByText("No repository profiles found"),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("link", {
        name: "How to manage repositories in Landscape",
      }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("link", {
        name: "How to manage repositories in Landscape",
      }),
    ).toHaveAttribute("href", MANAGE_REPOSITORIES_DOCUMENTATION_URL);
    expect(
      screen.getByRole("button", { name: /Add profile/i }),
    ).toBeInTheDocument();
  });

  it("filters profiles by search parameter from URL", async () => {
    const [firstProfile] = repositoryProfiles;
    renderWithProviders(
      <RepositoryProfileContainer
        unfilteredRepositoryProfilesResult={makeUnfilteredResult(
          repositoryProfiles.length,
        )}
      />,
      undefined,
      `/?search=${firstProfile.name}`,
    );

    await expectLoadingState();

    expect(screen.getByRole("table")).toBeInTheDocument();
  });
});

describe("RepositoryProfile request params", () => {
  let capturedUrl: URL | undefined;

  beforeEach(() => {
    capturedUrl = undefined;
    setEndpointStatus("default");

    server.use(
      http.get(`${API_URL}repositoryprofiles`, ({ request }) => {
        capturedUrl = new URL(request.url);
        return HttpResponse.json({
          results: repositoryProfiles,
          count: repositoryProfiles.length,
          next: null,
          previous: null,
        });
      }),
    );
  });

  it("omits search entirely when the search param is empty", async () => {
    renderWithProviders(
      <RepositoryProfileContainer
        unfilteredRepositoryProfilesResult={makeUnfilteredResult(
          repositoryProfiles.length,
        )}
      />,
      undefined,
      "/",
    );

    await vi.waitFor(() => {
      expect(capturedUrl).toBeDefined();
    });

    expect(capturedUrl?.searchParams.has("search")).toBe(false);
  });
});
