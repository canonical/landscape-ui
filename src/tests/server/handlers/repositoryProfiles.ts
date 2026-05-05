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

  http.post(`${API_URL}repositoryprofiles`, async ({ request }) => {
    const endpointStatus = getEndpointStatus();
    if (
      endpointStatus.status === "error" &&
      (!endpointStatus.path || endpointStatus.path === "repositoryprofiles")
    ) {
      throw getEndpointStatusApiError();
    }

    interface PostBody {
      title: string;
      access_group?: string;
      all_computers?: boolean;
      description?: string;
      tags?: string[];
      apt_sources?: {
        name: string;
        line: string;
        gpg_key: { content: string } | null;
      }[];
    }
    const body = (await request.json()) as PostBody;

    const newId = Math.max(...repositoryProfiles.map((p) => p.id)) + 1;
    const name = body.title.toLowerCase().replace(/\s+/g, "-");

    const aptSources: APTSource[] = (body.apt_sources ?? []).map((s, i) => ({
      id: newId * 100 + i + 1,
      name: s.name,
      line: s.line,
      gpg_key: s.gpg_key ? s.gpg_key.content : null,
      access_group: body.access_group ?? "global",
      profiles: [name],
    }));

    const newProfile: RepositoryProfile = {
      id: newId,
      name,
      title: body.title,
      description: body.description ?? "",
      access_group: body.access_group ?? "global",
      all_computers: body.all_computers ?? false,
      apt_sources: aptSources,
      applied_count: 0,
      tags: body.tags ?? [],
      pending_count: 0,
    };

    return HttpResponse.json(newProfile, { status: 201 });
  }),

  http.put(
    `${API_URL}repositoryprofiles/:name`,
    async ({ params, request }) => {
      interface PutBody {
        title: string;
        description: string;
        access_group: string;
        tags: string[];
        all_computers: boolean;
        add_apt_sources?: {
          name: string;
          line: string;
          gpg_key: { content: string } | null;
        }[];
        remove_apt_sources?: number[];
      }
      const body = (await request.json()) as PutBody;
      const profile = repositoryProfiles.find((p) => p.name === params.name);
      if (!profile) {
        return new HttpResponse(null, { status: 404 });
      }

      const { add_apt_sources, remove_apt_sources } = body;

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
          access_group: body.access_group,
          profiles: [profile.name],
        }));
        updatedSources = [...updatedSources, ...newSources];
      }

      const updatedProfile: RepositoryProfile = {
        id: profile.id,
        name: profile.name,
        title: body.title,
        description: body.description,
        access_group: body.access_group,
        all_computers: body.all_computers,
        apt_sources: updatedSources,
        applied_count: profile.applied_count,
        tags: body.tags,
        pending_count: profile.pending_count,
      };

      Object.assign(profile, updatedProfile);

      return HttpResponse.json(updatedProfile, { status: 200 });
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
