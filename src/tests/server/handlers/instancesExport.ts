import { API_URL } from "@/constants";
import type { InstancesExportJob } from "../../../features/instances/types/InstancesExportJob";
import { getEndpointStatus } from "@/tests/controllers/controller";
import { http, HttpResponse } from "msw";
import {
  createEndpointStatusError,
  createEndpointStatusNetworkError,
} from "./_constants";
import { shouldApplyEndpointStatus } from "./_helpers";

const EXPORTS_LIST_PATH = "computers/exports";

export default [
  http.get(`${API_URL}${EXPORTS_LIST_PATH}`, () => {
    if (shouldApplyEndpointStatus(EXPORTS_LIST_PATH)) {
      const { status, response } = getEndpointStatus();
      if (status === "error") {
        return createEndpointStatusNetworkError();
      }
      if (status === "empty") {
        return HttpResponse.json({ count: 0, results: [] });
      }
      if (status === "variant" && Array.isArray(response)) {
        const jobs = response as InstancesExportJob[];
        return HttpResponse.json({ count: jobs.length, results: jobs });
      }
    }
    return HttpResponse.json({ count: 0, results: [] });
  }),

  http.post(`${API_URL}computers/export/csv`, async ({ request }) => {
    if (shouldApplyEndpointStatus("computers/export/csv")) {
      const { status } = getEndpointStatus();
      if (status === "error") {
        return createEndpointStatusError();
      }
    }
    const body = (await request.json()) as Record<string, unknown>;
    const job: InstancesExportJob = {
      id: "job-new",
      name: typeof body.name === "string" ? body.name : "New export",
      filename: "instances-export.tsv",
      instanceCount: 0,
      attributeLabels: [],
      selectedFieldIds: Array.isArray(body.selected_field_ids)
        ? (body.selected_field_ids as string[])
        : [],
      createdAt: new Date().toISOString(),
      status: "processing",
      progress: 0,
      downloadReady: false,
    };
    return HttpResponse.json(job, { status: 201 });
  }),

  http.post(
    `${API_URL}computers/exports/:jobId/cancel`,
    ({ params }) => {
      if (shouldApplyEndpointStatus("computers/exports/:jobId/cancel")) {
        const { status } = getEndpointStatus();
        if (status === "error") {
          return createEndpointStatusError();
        }
      }
      const job: Partial<InstancesExportJob> = {
        id: params.jobId as string,
        status: "canceled",
      };
      return HttpResponse.json(job);
    },
  ),

  http.delete(`${API_URL}computers/exports/:jobId`, () => {
    if (shouldApplyEndpointStatus("computers/exports/:jobId")) {
      const { status } = getEndpointStatus();
      if (status === "error") {
        return createEndpointStatusError();
      }
    }
    return new HttpResponse(null, { status: 204 });
  }),

  http.get(`${API_URL}computers/exports/:jobId/download`, () => {
    if (shouldApplyEndpointStatus("computers/exports/:jobId/download")) {
      const { status } = getEndpointStatus();
      if (status === "error") {
        return createEndpointStatusNetworkError();
      }
    }
    return new HttpResponse("col1\tcol2\nval1\tval2", {
      headers: { "Content-Type": "text/tab-separated-values" },
    });
  }),

  http.get(`${API_URL}computers/export/annotations`, () => {
    if (shouldApplyEndpointStatus("computers/export/annotations")) {
      const { status } = getEndpointStatus();
      if (status === "error") {
        return createEndpointStatusError();
      }
    }
    return HttpResponse.json({ results: [] });
  }),
];
