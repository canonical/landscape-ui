import { delay, http, HttpResponse } from "msw";
import { employees } from "@/tests/mocks/employees";
import { employeeGroups, stagedOidcGroups } from "@/tests/mocks/employeeGroups";
import {
  generatePaginatedResponse,
  parseArray,
} from "@/tests/server/handlers/_helpers";
import type {
  EmployeeGroup,
  GetEmployeeGroupsParams,
  ImportEmployeeGroupsParams,
  ImportOidcSessionParams,
  OidcGroupImportSession,
  StagedOidcGroup,
} from "@/features/employee-groups";
import type { ApiPaginatedResponse } from "@/types/api/ApiPaginatedResponse";
import { API_URL, COMMON_NUMBERS } from "@/constants";
import { getEndpointStatus } from "@/tests/controllers/controller";
import type { Employee } from "@/features/employees";
import { oidcGroupImportSession } from "@/tests/mocks/oidcIssuers";

export default [
  http.get<never, GetEmployeeGroupsParams, ApiPaginatedResponse<EmployeeGroup>>(
    `${API_URL}employee_groups`,
    async ({ request }) => {
      const endpointStatus = getEndpointStatus();
      const url = new URL(request.url);
      const offset =
        Number(url.searchParams.get("offset")) || COMMON_NUMBERS.ZERO;
      const limit = Number(url.searchParams.get("limit")) || 20;
      const search = url.searchParams.get("name") ?? "";

      const employeeGroupIds = parseArray(
        url.searchParams.get("employee_group_ids"),
      );

      const autoinstallFileIds = parseArray(
        url.searchParams.get("autoinstall_file_ids"),
      );

      const groupIdFilteredEmployeeGroups =
        employeeGroupIds && employeeGroupIds.length > 0
          ? employeeGroups.filter(
              ({ id }) =>
                !employeeGroupIds || employeeGroupIds.includes(String(id)),
            )
          : employeeGroups;

      const filteredEmployeeGroups =
        autoinstallFileIds && autoinstallFileIds.length > 0
          ? groupIdFilteredEmployeeGroups.filter(
              ({ autoinstall_file }) =>
                !autoinstallFileIds ||
                autoinstallFileIds.includes(String(autoinstall_file?.id)),
            )
          : groupIdFilteredEmployeeGroups;

      return HttpResponse.json(
        generatePaginatedResponse<EmployeeGroup>({
          data: endpointStatus.status === "empty" ? [] : filteredEmployeeGroups,
          limit,
          offset,
          search,
          searchFields: ["name"],
        }),
      );
    },
  ),

  http.get<{ employeeGroupId: string }, never, EmployeeGroup>(
    `${API_URL}employee_groups/:employeeGroupId`,
    async ({ params }) => {
      const { employeeGroupId } = params;

      await delay();

      const employeeGroup = employeeGroups.find(
        ({ id }) => id === Number(employeeGroupId),
      );

      if (!employeeGroup) {
        throw new HttpResponse(null, { status: 404, statusText: "Not Found" });
      }

      return HttpResponse.json(employeeGroup);
    },
  ),

  http.get<{ employeeGroupId: string }, never, ApiPaginatedResponse<Employee>>(
    `${API_URL}employee_groups/:employeeGroupId/employees`,
    async () => {
      await delay();

      return HttpResponse.json(
        generatePaginatedResponse({
          data: employees,
          limit: undefined,
          offset: undefined,
        }),
      );
    },
  ),

  http.post<never, ImportOidcSessionParams, OidcGroupImportSession>(
    `${API_URL}oidc/groups/import_session`,
    async ({ request }) => {
      await delay();

      const { issuer_id } = await request.json();

      return HttpResponse.json({
        ...oidcGroupImportSession,
        issuer_id,
      });
    },
  ),

  http.get<
    never,
    { import_session_id: number },
    ApiPaginatedResponse<StagedOidcGroup>
  >(`${API_URL}oidc/groups/staged`, async ({ request }) => {
    await delay();

    const { searchParams } = new URL(request.url);

    const import_session_id = Number(searchParams.get("import_session_id"));

    const data = stagedOidcGroups.filter(
      (group) => group.import_session_id === import_session_id,
    );

    return HttpResponse.json(
      generatePaginatedResponse({
        data,
        limit: Number(searchParams.get("limit")),
        offset: Number(searchParams.get("offset")),
        search: searchParams.get("search") ?? "",
        searchFields: ["name"],
      }),
    );
  }),

  http.post<never, ImportEmployeeGroupsParams, ApiPaginatedResponse<number>>(
    `${API_URL}employee_groups`,
    async ({ request }) => {
      await delay();

      const { staged_oidc_group_ids, import_all } = await request.json();

      const preFilteredGroups = import_all
        ? stagedOidcGroups
        : stagedOidcGroups.filter((group) =>
            staged_oidc_group_ids.includes(group.id),
          );

      return HttpResponse.json(
        generatePaginatedResponse({
          data: preFilteredGroups.map((group) => group.id),
          limit: undefined,
          offset: undefined,
        }),
      );
    },
  ),
];
