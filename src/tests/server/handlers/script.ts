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
} from "@/tests/server/handlers/_helpers";
import { http, HttpResponse } from "msw";
import { getEndpointStatusApiError } from "./_constants";

export default [
  http.get(`${API_URL}scripts`, async ({ request }) => {
    const DEFAULT_PAGE_SIZE = 20;
    const endpointStatus = getEndpointStatus();
    const url = new URL(request.url);
    const limit = Number(url.searchParams.get("limit")) || DEFAULT_PAGE_SIZE;
    const offset = Number(url.searchParams.get("offset")) || 0;
    const search = url.searchParams.get("search") || "";

    if (
      !endpointStatus.path ||
      (endpointStatus.path && endpointStatus.path.includes("scripts"))
    ) {
      if (endpointStatus.status === "error") {
        throw new HttpResponse(null, { status: 500 });
      }

      if (endpointStatus.status === "empty") {
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
      throw getEndpointStatusApiError();
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

    if (
      getEndpointStatus().status === "error" &&
      getEndpointStatus().path === "CreateScript"
    ) {
      throw getEndpointStatusApiError();
    }

    return HttpResponse.json({ id: 99 });
  }),

  http.post(API_URL_OLD, ({ request }) => {
    if (!isAction(request, "CreateScriptAttachment")) {
      return;
    }

    if (
      getEndpointStatus().status === "error" &&
      getEndpointStatus().path === "CreateScriptAttachment"
    ) {
      throw getEndpointStatusApiError();
    }

    return HttpResponse.json({});
  }),

  http.post(API_URL_OLD, ({ request }) => {
    if (!isAction(request, "EditScript")) {
      return;
    }

    if (
      getEndpointStatus().status === "error" &&
      getEndpointStatus().path === "EditScript"
    ) {
      throw getEndpointStatusApiError();
    }

    return HttpResponse.json({});
  }),

  http.get(API_URL_OLD, ({ request }) => {
    if (!isAction(request, "RemoveScriptAttachment")) {
      return;
    }

    if (
      getEndpointStatus().status === "error" &&
      getEndpointStatus().path === "RemoveScriptAttachment"
    ) {
      throw getEndpointStatusApiError();
    }

    return HttpResponse.json({});
  }),

  http.get(API_URL_OLD, ({ request }) => {
    if (!isAction(request, "ExecuteScript")) {
      return;
    }

    if (
      getEndpointStatus().status === "error" &&
      getEndpointStatus().path === "ExecuteScript"
    ) {
      throw getEndpointStatusApiError();
    }

    return HttpResponse.json(activities[0]);
  }),

  http.post(`${API_URL}scripts/:id\\:archive`, async () => {
    const endpointStatus = getEndpointStatus();

    if (
      endpointStatus.status === "error" &&
      endpointStatus.path === "archive"
    ) {
      throw getEndpointStatusApiError();
    }

    return HttpResponse.json({});
  }),

  http.post(`${API_URL}scripts/:id\\:redact`, async () => {
    const endpointStatus = getEndpointStatus();

    if (
      endpointStatus.status === "error" &&
      endpointStatus.path === "redact"
    ) {
      throw getEndpointStatusApiError();
    }

    return HttpResponse.json({});
  }),

  http.post(`${API_URL}scripts/run`, async () => {
    const endpointStatus = getEndpointStatus();

    if (
      endpointStatus.status === "error" &&
      endpointStatus.path === "run"
    ) {
      throw getEndpointStatusApiError();
    }

    return HttpResponse.json({});
  }),
];
