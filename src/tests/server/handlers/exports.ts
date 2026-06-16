import { API_URL } from "@/constants";
import type { ExportJob } from "@/features/exports";
import { PATHS } from "@/libs/routes";
import { getEndpointStatus } from "@/tests/controllers/controller";
import { http, HttpResponse } from "msw";
import {
  createEndpointStatusError,
  createEndpointStatusNetworkError,
} from "./_constants";
import { shouldApplyEndpointStatus } from "./_helpers";

const EXPORTS_PATH = PATHS.exports.root;

const generateExportJobsResponse = (
  request: Request,
  jobs: ExportJob[],
): { count: number; results: ExportJob[] } => {
  const url = new URL(request.url);
  const search = url.searchParams.get("search") ?? "";
  const type = url.searchParams.get("type") ?? "";
  const limit = parseInt(url.searchParams.get("limit") ?? "50", 10);
  const offset = parseInt(url.searchParams.get("offset") ?? "0", 10);

  let filtered = search
    ? jobs.filter((job) =>
        job.name.toLowerCase().includes(search.toLowerCase()),
      )
    : jobs;
  if (type) {
    filtered = filtered.filter((job) => job.type === type);
  }

  return {
    count: filtered.length,
    results: filtered.slice(offset, offset + limit),
  };
};

export default [
  http.get(`${API_URL}${EXPORTS_PATH}`, ({ request }) => {
    if (shouldApplyEndpointStatus(EXPORTS_PATH)) {
      const { status, response } = getEndpointStatus();
      if (status === "error") return createEndpointStatusNetworkError();
      if (status === "loading") return new Promise(() => undefined);
      if (status === "empty") {
        return HttpResponse.json({ count: 0, results: [] });
      }
      if (status === "variant" && Array.isArray(response)) {
        return HttpResponse.json(
          generateExportJobsResponse(request, response as ExportJob[]),
        );
      }
    }
    return HttpResponse.json({ count: 0, results: [] });
  }),

  http.get(`${API_URL}${EXPORTS_PATH}/:jobId`, () => {
    if (shouldApplyEndpointStatus(`${EXPORTS_PATH}/:jobId`)) {
      const { status, response } = getEndpointStatus();
      if (status === "error") return createEndpointStatusNetworkError();
      if (
        status === "variant" &&
        response &&
        typeof response === "object" &&
        !Array.isArray(response)
      ) {
        return HttpResponse.json(response as unknown as ExportJob);
      }
    }
    return new HttpResponse(null, { status: 404 });
  }),

  http.post(`${API_URL}${EXPORTS_PATH}/:jobId/cancel`, () => {
    if (shouldApplyEndpointStatus(`${EXPORTS_PATH}/:jobId/cancel`)) {
      const { status } = getEndpointStatus();
      if (status === "error") return createEndpointStatusError();
    }
    return new HttpResponse(null, { status: 204 });
  }),

  http.delete(`${API_URL}${EXPORTS_PATH}/:jobId`, () => {
    if (shouldApplyEndpointStatus(`${EXPORTS_PATH}/:jobId`)) {
      const { status } = getEndpointStatus();
      if (status === "error") return createEndpointStatusError();
    }
    return new HttpResponse(null, { status: 204 });
  }),

  http.get(`${API_URL}${EXPORTS_PATH}/:jobId/download`, () => {
    if (shouldApplyEndpointStatus(`${EXPORTS_PATH}/:jobId/download`)) {
      const { status } = getEndpointStatus();
      if (status === "error") return createEndpointStatusNetworkError();
    }
    return new HttpResponse("tsv-data", {
      headers: {
        "Content-Disposition": `attachment; filename="export.tsv"`,
        "Content-Type": "text/tab-separated-values",
      },
    });
  }),
];
