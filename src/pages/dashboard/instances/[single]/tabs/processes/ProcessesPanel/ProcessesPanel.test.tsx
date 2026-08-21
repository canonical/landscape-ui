import { API_URL, DISPLAY_DATE_TIME_FORMAT } from "@/constants";
import { setEndpointStatus } from "@/tests/controllers/controller";
import { processes } from "@/tests/mocks/process";
import { renderWithProviders } from "@/tests/render";
import server from "@/tests/server";
import { screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import date from "@/libs/date";
import { http, HttpResponse } from "msw";
import { beforeEach, describe, expect, it, vi } from "vitest";
import ProcessesPanel from "./ProcessesPanel";

describe("ProcessesPanel", () => {
  it("renders empty state", async () => {
    setEndpointStatus("empty");
    renderWithProviders(<ProcessesPanel />);

    const emptyStateTitle = await screen.findByText("No processes running");
    expect(emptyStateTitle).toBeInTheDocument();
  });

  it("renders filtered list of processes", async () => {
    renderWithProviders(<ProcessesPanel />);

    for (const process of processes) {
      const listProcess = await screen.findByRole("row", {
        name: `Select process ${process.name}${process.name} ${process.state} ${process.vm_size} ${(100 * process.cpu_utilisation).toFixed(1)}% ${process.pid} ${date(process.start_time).format(DISPLAY_DATE_TIME_FORMAT)} ${process.gid}`,
      });
      expect(listProcess).toBeInTheDocument();
    }
    const searchBox = await screen.findByRole("searchbox");
    await userEvent.type(searchBox, `${processes[0].name}{enter}`);
    const processFound = await screen.findByRole("row", {
      name: `Select process ${processes[0].name}${processes[0].name} ${processes[0].state} ${processes[0].vm_size} ${(100 * processes[0].cpu_utilisation).toFixed(1)}% ${processes[0].pid} ${date(processes[0].start_time).format(DISPLAY_DATE_TIME_FORMAT)} ${processes[0].gid}`,
    });
    const processRemoved = screen.queryByRole("row", {
      name: `Select process ${processes[5].name}${processes[5].name} ${processes[5].state} ${processes[5].vm_size} ${(100 * processes[5].cpu_utilisation).toFixed(1)}% ${processes[5].pid} ${date(processes[5].start_time).format(DISPLAY_DATE_TIME_FORMAT)} ${processes[5].gid}`,
    });
    expect(processFound).toBeInTheDocument();
    expect(processRemoved).not.toBeInTheDocument();
  });
});

describe("Processes request params", () => {
  let capturedUrl: URL | undefined;

  beforeEach(() => {
    capturedUrl = undefined;
    setEndpointStatus("default");

    server.use(
      http.get(`${API_URL}computers/:computerId/processes`, ({ request }) => {
        capturedUrl = new URL(request.url);
        return HttpResponse.json({
          results: processes,
          count: processes.length,
          next: null,
          previous: null,
        });
      }),
    );
  });

  it("omits search entirely when the page param is empty", async () => {
    renderWithProviders(
      <ProcessesPanel />,
      undefined,
      "/instances/1/processes",
      "/instances/:instanceId/processes",
    );

    await vi.waitFor(() => {
      expect(capturedUrl).toBeDefined();
    });

    expect(capturedUrl?.searchParams.has("search")).toBe(false);
  });
});
