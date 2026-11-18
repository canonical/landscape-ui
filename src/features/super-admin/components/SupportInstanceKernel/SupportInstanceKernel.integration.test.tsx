import { setEndpointStatus } from "@/tests/controllers/controller";
import { instances } from "@/tests/mocks/instance";
import { buildLivepatchInfo, kernelManagementInfo } from "@/tests/mocks/kernel";
import { renderWithProviders } from "@/tests/render";
import server from "@/tests/server";
import { setStaffGlobalRoles } from "@/tests/server/handlers/staffAccounts";
import { screen } from "@testing-library/react";
import { beforeEach, describe, expect, it } from "vitest";
import SupportInstanceKernel from "./SupportInstanceKernel";
import AppErrorBoundary from "@/components/layout/AppErrorBoundary/AppErrorBoundary";

const ACME = "acme";

/** Every kernel action control the account's own kernel tab would render. */
const ACTION_CONTROLS = [
  /restart instance/i,
  /downgrade kernel/i,
  /upgrade kernel/i,
  /enable livepatch/i,
  /disable livepatch/i,
];

describe("SupportInstanceKernel (integration)", () => {
  beforeEach(() => {
    setStaffGlobalRoles(["SupportProvider"]);
    setEndpointStatus([
      {
        status: "variant",
        path: "computers/:computerId/livepatch/kernel",
        response: kernelManagementInfo,
      },
      {
        status: "variant",
        path: "computers/:computerId/livepatch/info",
        response: buildLivepatchInfo(),
      },
    ]);
  });

  it("shows the account's kernel and Livepatch data", async () => {
    const { container } = renderWithProviders(
      <SupportInstanceKernel name={ACME} instance={instances[0]} />,
    );

    expect(
      await screen.findByRole("heading", { name: /kernel overview/i }),
    ).toBeInTheDocument();

    expect(container).toHaveInfoItem(
      "current kernel version",
      "5.4.0-100-generic",
    );

    for (const cve of ["cve-2013-1700", "cve-2013-1800", "cve-2013-1900"]) {
      expect(screen.getByText(cve)).toBeInTheDocument();
    }
  });

  it("offers no kernel action and reaches no mutation", async () => {
    const mutations: string[] = [];
    const captureMutation = ({ request }: { request: Request }) => {
      if (request.method !== "GET") {
        mutations.push(`${request.method} ${request.url}`);
      }
    };

    server.events.on("request:start", captureMutation);

    renderWithProviders(
      <SupportInstanceKernel name={ACME} instance={instances[0]} />,
    );

    try {
      await screen.findByText("cve-2013-1700");

      for (const control of ACTION_CONTROLS) {
        expect(
          screen.queryByRole("button", { name: control }),
        ).not.toBeInTheDocument();
      }

      expect(mutations).toEqual([]);
    } finally {
      server.events.removeListener("request:start", captureMutation);
    }
  });

  it("shows an empty state when the instance has no kernel information", async () => {
    setEndpointStatus({ status: "empty" });

    renderWithProviders(
      <SupportInstanceKernel name={ACME} instance={instances[0]} />,
    );

    expect(
      await screen.findByText(
        "Kernel information is not available for this instance.",
      ),
    ).toBeInTheDocument();
  });

  it("throws when the kernel information fails to load", async () => {
    vi.spyOn(console, "error").mockReturnValue(undefined);
    setEndpointStatus({
      status: "error",
      path: "computers/:computerId/livepatch/kernel",
    });

    renderWithProviders(
      <AppErrorBoundary>
        <SupportInstanceKernel name={ACME} instance={instances[0]} />
      </AppErrorBoundary>,
      undefined,
      "/instances/1",
      "/instances/:instanceId",
    );

    expect(
      await screen.findByText("The kernel information could not be loaded."),
    ).toBeInTheDocument();
  });
});
