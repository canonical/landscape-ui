import { delay, http, HttpResponse } from "msw";
import { employees } from "@/tests/mocks/employees";
import { employeeGroups, stagedOidcGroups } from "@/tests/mocks/employeeGroups";
import { generatePaginatedResponse } from "@/tests/server/handlers/_helpers";
import type {
  EmployeeGroup,
  GetEmployeeGroupsParams,
  OidcGroupImportSession,
  StagedOidcGroup,
} from "@/features/employee-groups";
import type { ApiPaginatedResponse } from "@/types/ApiPaginatedResponse";
import { API_URL } from "@/constants";
import { getEndpointStatus } from "@/tests/controllers/controller";
import type { Employee } from "@/features/employees";

export default [
  http.get<never, GetEmployeeGroupsParams, ApiPaginatedResponse<EmployeeGroup>>(
    `${API_URL}employee_groups`,
    async ({ request }) => {
      const endpointStatus = getEndpointStatus();

      const url = new URL(request.url);
      const offset = Number(url.searchParams.get("offset")) || 0;
      const limit = Number(url.searchParams.get("limit")) || 20;
      const search = url.searchParams.get("search") ?? "";

      return HttpResponse.json(
        generatePaginatedResponse<EmployeeGroup>({
          data: endpointStatus === "empty" ? [] : employeeGroups,
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
        (employeeGroup) => employeeGroup.id === Number(employeeGroupId),
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

  http.post<never, { issuer: string }, OidcGroupImportSession>(
    `${API_URL}oidc/groups/import_session`,
    async ({ request }) => {
      await delay();

      const { issuer } = await request.json();

      return HttpResponse.json({
        id: 1,
        issuer,
        account_id: 1,
        status: "IN_PROGRESS",
        synced_at: new Date().toISOString(),
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

  http.post<never, number[], { results: number[] }>(
    `${API_URL}employee_groups`,
    async ({ request }) => {
      const groupIds = await request.json();

      await delay();

      return HttpResponse.json({ results: groupIds });
    },
  ),
];
