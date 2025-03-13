import { delay, http, HttpResponse } from "msw";
import { employees } from "@/tests/mocks/employees";
import { employeeGroups, stagedOidcGroups } from "@/tests/mocks/employeeGroups";
import { generatePaginatedResponse } from "@/tests/server/handlers/_helpers";
import type {
  EmployeeGroup,
  GetEmployeeGroupsParams,
  ImportEmployeeGroupsParams,
  ImportOidcSessionParams,
  OidcGroupImportSession,
  StagedOidcGroup,
} from "@/features/employee-groups";
import type { ApiPaginatedResponse } from "@/types/ApiPaginatedResponse";
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
      const search = url.searchParams.get("search") ?? "";

      return HttpResponse.json(
        generatePaginatedResponse<EmployeeGroup>({
          data: endpointStatus.status === "empty" ? [] : employeeGroups,
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
        limit: undefined,
        offset: undefined,
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
