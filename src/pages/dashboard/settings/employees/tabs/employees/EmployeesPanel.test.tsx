import { API_URL } from "@/constants";
import { setEndpointStatus } from "@/tests/controllers/controller";
import { employees } from "@/tests/mocks/employees";
import { expectLoadingState } from "@/tests/helpers";
import { renderWithProviders } from "@/tests/render";
import server from "@/tests/server";
import { screen } from "@testing-library/react";
import { http, HttpResponse } from "msw";
import { beforeEach, describe, expect, it, vi } from "vitest";
import EmployeesPanel from "./EmployeesPanel";
import { EMPTY_STATE } from "./constants";

describe("EmployeesPanel", () => {
  beforeEach(() => {
    setEndpointStatus("default");
  });

  it("renders list of employees", async () => {
    renderWithProviders(<EmployeesPanel />);

    await expectLoadingState();

    for (const employee of employees) {
      expect(screen.getByText(employee.name)).toBeInTheDocument();
    }
  });

  it("renders empty state when no employees are found", async () => {
    setEndpointStatus("empty");

    renderWithProviders(<EmployeesPanel />);

    await expectLoadingState();

    expect(screen.getByText(EMPTY_STATE.title)).toBeInTheDocument();
    expect(screen.getByText(EMPTY_STATE.body)).toBeInTheDocument();
  });

  it("renders employee limit notification when limit is reached", async () => {
    setEndpointStatus({
      status: "variant",
      path: "employees",
      response: {
        count: 100_000,
        next: null,
        previous: null,
        results: employees.slice(0, 1),
      },
    });

    renderWithProviders(<EmployeesPanel />);

    await expectLoadingState();

    expect(screen.getByText(/Employee limit reached/i)).toBeInTheDocument();
  });
});

describe("Employees request params", () => {
  let capturedUrl: URL | undefined;

  beforeEach(() => {
    capturedUrl = undefined;
    setEndpointStatus("default");

    server.use(
      http.get(`${API_URL}employees`, ({ request }) => {
        capturedUrl = new URL(request.url);
        return HttpResponse.json({
          results: employees,
          count: employees.length,
          next: null,
          previous: null,
        });
      }),
    );
  });

  it("omits search entirely when the page param is empty", async () => {
    renderWithProviders(<EmployeesPanel />, undefined, "/employees");

    await vi.waitFor(() => {
      expect(capturedUrl).toBeDefined();
    });

    expect(capturedUrl?.searchParams.has("search")).toBe(false);
  });
});
