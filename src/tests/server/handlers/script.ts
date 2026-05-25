import { API_URL, API_URL_OLD } from "@/constants";
import { getEndpointStatus } from "@/tests/controllers/controller";
import { activities } from "@/tests/mocks/activity";
import {
  detailedScriptsData,
  scriptAttachment,
  scriptAttachmentHtml,
  scripts,
  scriptVersion,
  scriptVersionsWithPagination,
} from "@/tests/mocks/script";
import { scriptProfiles } from "@/tests/mocks/scriptProfiles";
import {
  generatePaginatedResponse,
  isAction,
  shouldApplyEndpointStatus,
} from "@/tests/server/handlers/_helpers";
import { delay, http, HttpResponse } from "msw";
import {
  createEndpointStatusError,
  createEndpointStatusNetworkError,
} from "./_constants";

export default [
  http.get(`${API_URL}scripts`, async ({ request }) => {
    const DEFAULT_PAGE_SIZE = 20;
    const url = new URL(request.url);
    const limit = Number(url.searchParams.get("limit")) || DEFAULT_PAGE_SIZE;
    const offset = Number(url.searchParams.get("offset")) || 0;
    const search = url.searchParams.get("search") || "";

    if (shouldApplyEndpointStatus("scripts")) {
      const { status } = getEndpointStatus();

      if (status === "error") {
        throw createEndpointStatusNetworkError();
      }

      if (status === "empty") {
        return HttpResponse.json({
          results: [],
          count: 0,
          next: null,
          previous: null,
        });
      }
    }

    return HttpResponse.json(
      generatePaginatedResponse({
        data: scripts,
        limit: limit,
        offset: offset,
        search: search,
        searchFields: ["title"],
      }),
    );
  }),

  http.get(`${API_URL}scripts/:id/script-profiles`, async () => {
    const endpointStatus = getEndpointStatus();

    if (
      endpointStatus.status === "empty" &&
      endpointStatus.path === "script-profiles"
    ) {
      return HttpResponse.json({
        results: [],
        count: 0,
        next: null,
        previous: null,
      });
    }

    return HttpResponse.json({
      results: scriptProfiles,
      count: scriptProfiles.length,
      next: null,
      previous: null,
    });
  }),

  http.get(`${API_URL}scripts/:id`, async ({ params }) => {
    const id = Number(params.id);
    const scriptDetails = detailedScriptsData.find(
      (script) => script.id === id,
    );

    return HttpResponse.json(scriptDetails);
  }),

  http.get(`${API_URL}scripts/:id/versions/:versionId`, async () => {
    const endpointStatus = getEndpointStatus();

    if (
      endpointStatus.status === "error" &&
      endpointStatus.path === "scripts/versions/detail"
    ) {
      throw createEndpointStatusError();
    }

    return HttpResponse.json(scriptVersion);
  }),

  http.get(
    `${API_URL}scripts/:id/attachments/:attachmentId`,
    async ({ params }) => {
      if (params.attachmentId === "999") {
        return new HttpResponse(null, { status: 404 });
      }

      const endpointStatus = getEndpointStatus();

      if (
        endpointStatus.path &&
        endpointStatus.path.includes("scripts/attachments/html")
      ) {
        return new HttpResponse(scriptAttachmentHtml, {
          headers: {
            "Content-Type": "text/html",
          },
        });
      }

      return new HttpResponse(scriptAttachment, {
        headers: {
          "Content-Type": "text/plain",
        },
      });
    },
  ),

  http.get(`${API_URL}scripts/:id/versions`, async ({ request }) => {
    const endpointStatus = getEndpointStatus();

    if (
      endpointStatus.status === "loading" &&
      (!endpointStatus.path || endpointStatus.path === "scripts/versions")
    ) {
      await delay("infinite");
    }

    const DEFAULT_PAGE_SIZE = 20;
    const url = new URL(request.url);
    const limit = Number(url.searchParams.get("limit")) || DEFAULT_PAGE_SIZE;
    const offset = Number(url.searchParams.get("offset")) || 0;

    return HttpResponse.json(
      generatePaginatedResponse({
        data: scriptVersionsWithPagination,
        limit: limit,
        offset: offset,
        search: "",
        searchFields: ["title"],
      }),
    );
  }),

  http.post(API_URL_OLD, ({ request }) => {
    if (!isAction(request, "CreateScript")) {
      return;
    }

    const endpointStatus = getEndpointStatus();
    if (
      endpointStatus.status === "error" &&
      endpointStatus.path === "CreateScript"
    ) {
      throw createEndpointStatusError();
    }

    return HttpResponse.json({ id: 99 });
  }),

  http.post(API_URL_OLD, ({ request }) => {
    if (!isAction(request, "CreateScriptAttachment")) {
      return;
    }

    const endpointStatus = getEndpointStatus();
    if (
      endpointStatus.status === "error" &&
      endpointStatus.path === "CreateScriptAttachment"
    ) {
      throw createEndpointStatusError();
    }

    return HttpResponse.json({});
  }),

  http.post(API_URL_OLD, ({ request }) => {
    if (!isAction(request, "EditScript")) {
      return;
    }

    const endpointStatus = getEndpointStatus();
    if (
      endpointStatus.status === "error" &&
      endpointStatus.path === "EditScript"
    ) {
      throw createEndpointStatusError();
    }

    return HttpResponse.json({});
  }),

  http.get(API_URL_OLD, ({ request }) => {
    if (!isAction(request, "RemoveScriptAttachment")) {
      return;
    }

    const endpointStatus = getEndpointStatus();
    if (
      endpointStatus.status === "error" &&
      endpointStatus.path === "RemoveScriptAttachment"
    ) {
      throw createEndpointStatusError();
    }

    return HttpResponse.json({});
  }),

  http.get(API_URL_OLD, ({ request }) => {
    if (!isAction(request, "ExecuteScript")) {
      return;
    }

    const endpointStatus = getEndpointStatus();
    if (
      endpointStatus.status === "error" &&
      endpointStatus.path === "ExecuteScript"
    ) {
      throw createEndpointStatusError();
    }

    return HttpResponse.json(activities[0]);
  }),

  http.post(`${API_URL}scripts/:id\\:archive`, async () => {
    const endpointStatus = getEndpointStatus();

    if (
      endpointStatus.status === "error" &&
      endpointStatus.path === "archive"
    ) {
      throw createEndpointStatusError();
    }

    return HttpResponse.json({});
  }),

  http.post(`${API_URL}scripts/:id\\:redact`, async () => {
    if (shouldApplyEndpointStatus("redact")) {
      const { status } = getEndpointStatus();
      if (status === "error") {
        throw createEndpointStatusError();
      }
    }

    return HttpResponse.json({});
  }),

  http.post(`${API_URL}scripts/run`, async () => {
    if (shouldApplyEndpointStatus("run")) {
      const { status } = getEndpointStatus();
      if (status === "error") {
        throw createEndpointStatusError();
      }
    }

    return HttpResponse.json({});
  }),
];
