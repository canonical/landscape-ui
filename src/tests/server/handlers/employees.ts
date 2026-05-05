import { API_URL } from "@/constants";
import type { Employee, GetEmployeesParams } from "@/features/employees";
import { getEndpointStatus } from "@/tests/controllers/controller";
import { employees } from "@/tests/mocks/employees";
import {
  generatePaginatedResponse,
  shouldApplyEndpointStatus,
} from "@/tests/server/handlers/_helpers";
import { delay, http, HttpResponse } from "msw";
import { createEndpointStatusError } from "./_constants";

export default [
  http.get<never, GetEmployeesParams>(
    `${API_URL}employees`,
    async ({ request }) => {
      const DEFAULT_PAGE_SIZE = 20;
      const url = new URL(request.url);
      const offset = Number(url.searchParams.get("offset")) || 0;
      const limit = Number(url.searchParams.get("limit")) || DEFAULT_PAGE_SIZE;
      const search = url.searchParams.get("search") ?? "";

      const endpointStatus = getEndpointStatus();

      if (shouldApplyEndpointStatus("employees")) {
        if (endpointStatus.status === "error") {
          throw createEndpointStatusError();
        }

        if (endpointStatus.status === "loading" && offset > 0) {
          await delay("infinite");
        }
      }

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

  http.post(`${API_URL}employees/:id/computers`, async () => {
    if (shouldApplyEndpointStatus("associateEmployeeWithInstance")) {
      const { status } = getEndpointStatus();
      if (status === "error") {
        throw createEndpointStatusError();
      }
    }

    return HttpResponse.json();
  }),

  http.delete(`${API_URL}employees/:id/computers/:computerId`, async () => {
    if (shouldApplyEndpointStatus("disassociateEmployeeFromInstance")) {
      const { status } = getEndpointStatus();
      if (status === "error") {
        throw createEndpointStatusError();
      }
    }

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
