import { API_URL } from "@/constants";
import type {
  EmployeeGroup,
  GetEmployeeGroupsParams,
} from "@/features/employee-groups";
import type { Employee, GetEmployeesParams } from "@/features/employees";
import { getEndpointStatus } from "@/tests/controllers/controller";
import { employeeGroups, employees } from "@/tests/mocks/employees";
import { generatePaginatedResponse } from "@/tests/server/handlers/_helpers";
import type { ApiPaginatedResponse } from "@/types/ApiPaginatedResponse";
import { http, HttpResponse } from "msw";

export default [
  http.get<never, GetEmployeesParams, ApiPaginatedResponse<Employee>>(
    `${API_URL}employees`,
    async ({ request }) => {
      const endpointStatus = getEndpointStatus();

      const url = new URL(request.url);
      const offset = Number(url.searchParams.get("offset")) || 0;
      const limit = Number(url.searchParams.get("limit")) || 20;
      const search = url.searchParams.get("search") ?? "";

      return HttpResponse.json(
        generatePaginatedResponse<Employee>({
          data: endpointStatus === "empty" ? [] : employees,
          limit,
          offset,
          search,
          searchFields: ["name"],
        }),
      );
    },
  ),

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

  http.delete(`${API_URL}employees/:id`, async () => {
    return HttpResponse.json();
  }),
];
