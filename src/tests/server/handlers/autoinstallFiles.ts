import { API_URL } from "@/constants";
import type {
  AddAutoinstallFileParams,
  AutoinstallFile,
  DeleteAutoinstallFileParams,
  GetAutoinstallFileParams,
  GetAutoinstallFilesParams,
  UpdateAutoinstallFileParams,
} from "@/features/autoinstall-files";
import { getEndpointStatus } from "@/tests/controllers/controller";
import { autoinstallFiles } from "@/tests/mocks/autoinstallFiles";
import {
  generatePaginatedResponse,
  shouldApplyEndpointStatus,
} from "@/tests/server/handlers/_helpers";
import type { ApiPaginatedResponse } from "@/types/api/ApiPaginatedResponse";
import { delay, http, HttpResponse } from "msw";
import { createEndpointStatusError } from "./_constants";

export default [
  http.get<
    never,
    GetAutoinstallFilesParams,
    ApiPaginatedResponse<AutoinstallFile>
  >(`${API_URL}autoinstall`, async ({ request }) => {
    const DEFAULT_PAGE_SIZE = 20;
    const endpointStatus = getEndpointStatus();

    const url = new URL(request.url);
    const offset = Number(url.searchParams.get("offset")) || 0;
    const limit = Number(url.searchParams.get("limit")) || DEFAULT_PAGE_SIZE;
    const search = url.searchParams.get("search") ?? "";

    return HttpResponse.json(
      generatePaginatedResponse<AutoinstallFile>({
        data: endpointStatus.status === "empty" ? [] : autoinstallFiles,
        limit,
        offset,
        search,
        searchFields: ["filename"],
      }),
    );
  }),

  http.get<
    { autoinstallFileId: string },
    GetAutoinstallFileParams,
    AutoinstallFile
  >(`${API_URL}autoinstall/:autoinstallFileId`, async ({ params, request }) => {
    const { autoinstallFileId } = params;

    await delay();

    const autoinstallFile = autoinstallFiles.find(
      (file) => file.id === Number(autoinstallFileId),
    );

    if (!autoinstallFile) {
      throw new HttpResponse(null, { status: 404, statusText: "Not Found" });
    }

    const url = new URL(request.url);
    const withMetadata = url.searchParams.get("with_metadata") === "true";

    if (withMetadata) {
      if (
        shouldApplyEndpointStatus("autoinstall") &&
        getEndpointStatus().status === "variant"
      ) {
        return HttpResponse.json({
          ...autoinstallFile,
          metadata: getEndpointStatus().response,
        });
      }

      return HttpResponse.json({
        ...autoinstallFile,
        metadata: {
          current_version: autoinstallFile.version,
          max_versions: 5,
          versions: [],
        },
      });
    }

    return HttpResponse.json(autoinstallFile);
  }),

  http.post<never, AddAutoinstallFileParams, AutoinstallFile>(
    `${API_URL}autoinstall`,
    async ({ request }) => {
      await delay();

      return HttpResponse.json({
        ...(await request.json()),
        created_at: "",
        id: 0,
        is_default: false,
        last_modified_at: "",
        version: 1,
      });
    },
  ),
  http.post(`${API_URL}autoinstall:validate`, async () => {
    if (shouldApplyEndpointStatus("autoinstall-validate")) {
      const { status, response } = getEndpointStatus();
      if (status === "variant") {
        return HttpResponse.json(response, { status: 400 });
      }
    }

    if (shouldApplyEndpointStatus("autoinstall:validate")) {
      const { status } = getEndpointStatus();
      if (status === "error") {
        throw createEndpointStatusError();
      }
    }

    return HttpResponse.json({});
  }),

  http.delete<{ autoinstallFileId: string }, DeleteAutoinstallFileParams, null>(
    `${API_URL}autoinstall/:autoinstallFileId`,
    async () => {
      return HttpResponse.json();
    },
  ),

  http.patch<
    { autoinstallFileId: string },
    UpdateAutoinstallFileParams,
    AutoinstallFile
  >(`${API_URL}autoinstall/:autoinstallFileId`, async ({ params, request }) => {
    const { autoinstallFileId } = params;
    const { contents, is_default } = await request.json();

    await delay();

    const autoinstallFile = autoinstallFiles.find(
      (file) => file.id === Number(autoinstallFileId),
    );

    if (!autoinstallFile) {
      throw new HttpResponse(null, { status: 404, statusText: "Not Found" });
    }

    return HttpResponse.json({
      ...autoinstallFile,
      contents: contents ?? autoinstallFile.contents,
      is_default: is_default ?? autoinstallFile.is_default,
    });
  }),
];
