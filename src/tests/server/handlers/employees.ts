import { API_URL, COMMON_NUMBERS } from "@/constants";
import type { Employee, GetEmployeesParams } from "@/features/employees";
import { getEndpointStatus } from "@/tests/controllers/controller";
import { employees } from "@/tests/mocks/employees";
import { generatePaginatedResponse } from "@/tests/server/handlers/_helpers";
import type { ApiPaginatedResponse } from "@/types/ApiPaginatedResponse";
import { http, HttpResponse } from "msw";

export default [
  http.get<never, GetEmployeesParams, ApiPaginatedResponse<Employee>>(
    `${API_URL}employees`,
    async ({ request }) => {
      const endpointStatus = getEndpointStatus();

      const url = new URL(request.url);
      const offset =
        Number(url.searchParams.get("offset")) || COMMON_NUMBERS.ZERO;
      const limit = Number(url.searchParams.get("limit")) || 20;
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

  http.delete(`${API_URL}employees/:id`, async () => {
    return HttpResponse.json();
  }),
];
