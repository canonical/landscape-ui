import { API_URL } from "@/constants";
import type { Employee, GetEmployeesParams } from "@/features/employees";
import { getEndpointStatus } from "@/tests/controllers/controller";
import { employees } from "@/tests/mocks/employees";
import { generatePaginatedResponse } from "@/tests/server/handlers/_helpers";
import type { ApiPaginatedResponse } from "@/types/api/ApiPaginatedResponse";
import { http, HttpResponse } from "msw";

export default [
  http.get<never, GetEmployeesParams, ApiPaginatedResponse<Employee>>(
    `${API_URL}employees`,
    async ({ request }) => {
      const DEFAULT_PAGE_SIZE = 20;

      const endpointStatus = getEndpointStatus();

      const url = new URL(request.url);
      const offset = Number(url.searchParams.get("offset")) || 0;
      const limit = Number(url.searchParams.get("limit")) || DEFAULT_PAGE_SIZE;
      const search = url.searchParams.get("search") ?? "";

      return HttpResponse.json(
        generatePaginatedResponse<Employee>({
          data: endpointStatus.status === "empty" ? [] : employees,
          limit,
          offset,
          search,
          searchFields: ["name"],
        }),
      );
    },
  ),

  http.patch(`${API_URL}employees/:id`, async () => {
    return HttpResponse.json();
  }),

  http.post(`${API_URL}employees/:id/offboard`, async () => {
    return HttpResponse.json();
  }),

  http.delete(`${API_URL}employees/:id`, async () => {
    return HttpResponse.json();
  }),

  http.get(`${API_URL}employees/:id`, async () => {
    return HttpResponse.json(employees[0]);
  }),
];
