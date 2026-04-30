import { API_URL, API_URL_OLD } from "@/constants";
import { getEndpointStatus } from "@/tests/controllers/controller";
import { repositoryProfiles } from "@/tests/mocks/repositoryProfiles";
import type { RepositoryProfile } from "@/features/repository-profiles";
import type { APTSource } from "@/features/repository-profiles";
import { http, HttpResponse } from "msw";
import { getEndpointStatusApiError } from "./_constants";
import {
  generatePaginatedResponse,
  shouldApplyEndpointStatus,
  isAction,
} from "./_helpers";
import { createEndpointStatusNetworkError } from "./_constants";

export default [
  http.get(`${API_URL}repositoryprofiles`, ({ request }) => {
    const endpointStatus = getEndpointStatus();
    if (shouldApplyEndpointStatus("repositoryprofiles")) {
      if (endpointStatus.status === "error") {
        throw createEndpointStatusNetworkError();
      }
    }

    if (
      endpointStatus.status === "empty" &&
      (!endpointStatus.path || endpointStatus.path === "repositoryprofiles")
    ) {
      return HttpResponse.json(
        generatePaginatedResponse({ data: [], limit: 20, offset: 0 }),
      );
    }

    const { searchParams } = new URL(request.url);

    const names =
      searchParams.get("search")?.toLowerCase().split(",") ?? undefined;
    const limit = parseInt(searchParams.get("limit") ?? "20");
    const offset = parseInt(searchParams.get("offset") ?? "0");

    return HttpResponse.json(
      generatePaginatedResponse({
        data: names
          ? repositoryProfiles.filter((repositoryProfile) =>
              names.includes(repositoryProfile.name),
            )
          : repositoryProfiles,
        limit,
        offset,
      }),
    );
  }),

  http.post(`${API_URL}repositoryprofiles`, async () => {
    const endpointStatus = getEndpointStatus();
    if (
      endpointStatus.status === "error" &&
      (!endpointStatus.path || endpointStatus.path === "repositoryprofiles")
    ) {
      throw getEndpointStatusApiError();
    }
    return HttpResponse.json(repositoryProfiles[0], { status: 201 });
  }),

  http.put(
    `${API_URL}repositoryprofiles/:name`,
    async ({ params, request }) => {
      type PutBody = Omit<Partial<RepositoryProfile>, "apt_sources"> & {
        add_apt_sources?: {
          name: string;
          line: string;
          gpg_key: { content: string } | null;
        }[];
        remove_apt_sources?: number[];
      };
      const body = (await request.json()) as PutBody;
      const profile = repositoryProfiles.find((p) => p.name === params.name);
      if (!profile) {
        return new HttpResponse(null, { status: 404 });
      }

      const { add_apt_sources, remove_apt_sources, ...rest } = body;

      let updatedSources: APTSource[] = profile.apt_sources ?? [];
      if (remove_apt_sources?.length) {
        updatedSources = updatedSources.filter(
          (s) => !remove_apt_sources.includes(s.id),
        );
      }
      if (add_apt_sources?.length) {
        const maxId = Math.max(0, ...updatedSources.map((s) => s.id));
        const newSources: APTSource[] = add_apt_sources.map((s, i) => ({
          id: maxId + i + 1,
          name: s.name,
          line: s.line,
          gpg_key: s.gpg_key ? s.gpg_key.content : null,
          access_group: profile.access_group,
          profiles: [profile.name],
        }));
        updatedSources = [...updatedSources, ...newSources];
      }

      Object.assign(profile, { ...rest, apt_sources: updatedSources });

      return HttpResponse.json(profile, { status: 200 });
    },
  ),

  http.get(API_URL_OLD, ({ request }) => {
    if (!isAction(request, "RemoveRepositoryProfile")) {
      return;
    }

    const endpointStatus = getEndpointStatus();
    if (
      endpointStatus.status === "error" &&
      (!endpointStatus.path ||
        endpointStatus.path === "RemoveRepositoryProfile")
    ) {
      throw getEndpointStatusApiError();
    }

    return HttpResponse.json({ id: 1 }, { status: 200 });
  }),
];
