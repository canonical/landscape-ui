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
import { generatePaginatedResponse } from "@/tests/server/handlers/_helpers";
import type { ApiPaginatedResponse } from "@/types/ApiPaginatedResponse";
import { delay, http, HttpResponse } from "msw";

export default [
  http.get<
    never,
    GetAutoinstallFilesParams,
    ApiPaginatedResponse<AutoinstallFile>
  >(`${API_URL}autoinstall`, async ({ request }) => {
    const endpointStatus = getEndpointStatus();

    const url = new URL(request.url);
    const offset = Number(url.searchParams.get("offset")) || 0;
    const limit = Number(url.searchParams.get("limit")) || 20;
    const search = url.searchParams.get("search") ?? "";

    return HttpResponse.json(
      generatePaginatedResponse<AutoinstallFile>({
        data: endpointStatus === "empty" ? [] : autoinstallFiles,
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
  >(`${API_URL}autoinstall/:autoinstallFileId`, async ({ params }) => {
    const { autoinstallFileId } = params;

    await delay();

    const autoinstallFile = autoinstallFiles.find(
      (file) => file.id === Number(autoinstallFileId),
    );

    if (!autoinstallFile) {
      throw new HttpResponse(null, { status: 404, statusText: "Not Found" });
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
