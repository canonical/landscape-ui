import { API_URL } from "@/constants";
import type {
  KernelManagementInfo,
  LivepatchInformation,
} from "@/features/kernel";
import { setEndpointStatus } from "@/tests/controllers/controller";
import { renderWithProviders } from "@/tests/render";
import server from "@/tests/server";
import { screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { http, HttpResponse } from "msw";
import { afterEach, beforeEach, describe, expect, it } from "vitest";
import SupportInstanceKernel from "./SupportInstanceKernel";
import { instances } from "@/tests/mocks/instance";

const kernelManagementInfo: KernelManagementInfo = {
  downgrades: [
    { id: 10, name: "linux", version: "5.4.0-99", version_rounded: "5.4.0-99" },
  ],
  installed: {
    id: 11,
    name: "linux",
    version: "5.4.0-100",
    version_rounded: "5.4.0-100",
  },
  message: "",
  smart_status: "Kernel upgrade available",
  upgrades: [
    {
      id: 12,
      name: "linux",
      version: "5.4.0-101",
      version_rounded: "5.4.0-101",
    },
  ],
};

/** Fixes in a deliberately unsorted order, so sorting is observable. */
const buildLivepatchInfo = (): LivepatchInformation => ({
  ubuntu_pro_livepatch_service_info: null,
  ubuntu_pro_reboot_required_info: null,
  livepatch_info: {
    json: {
      error: "",
      return_code: 0,
      output: {
        tier: "tier",
        Status: [
          {
            Kernel: "5.4.0-100-generic",
            Running: true,
            Supported: "Supported",
            UpgradeRequiredDate: "2026-10-20",
            Livepatch: {
              CheckState: "checked",
              State: "applied",
              Version: "Version",
              Fixes: [
                {
                  Name: "cve-2013-1800",
                  Patched: true,
                  Bug: "bug-b",
                  Description: "Middle description",
                },
                {
                  Name: "cve-2013-1900",
                  Patched: false,
                  Bug: "bug-c",
                  Description: "Last description",
                },
                {
                  Name: "cve-2013-1700",
                  Patched: false,
                  Bug: "bug-a",
                  Description: "First description",
                },
              ],
            },
          },
        ],
      },
    },
  },
});

const mockKernel = (info: KernelManagementInfo = kernelManagementInfo) => {
  server.use(
    http.get(`${API_URL}computers/:computerId/livepatch/kernel`, () =>
      HttpResponse.json(info),
    ),
    http.get(`${API_URL}computers/:computerId/livepatch/info`, () =>
      HttpResponse.json(buildLivepatchInfo()),
    ),
  );
};

/** Every kernel action control the account's own kernel tab would render. */
const ACTION_CONTROLS = [
  /restart instance/i,
  /downgrade kernel/i,
  /upgrade kernel/i,
  /enable livepatch/i,
  /disable livepatch/i,
];

describe("SupportInstanceKernelTab (integration)", () => {
  const user = userEvent.setup();

  afterEach(() => {
    setEndpointStatus("default");
  });

  beforeEach(() => {
    mockKernel();
  });

  it("shows the same kernel and Livepatch data the account's tab shows", async () => {
    const { container } = renderWithProviders(
      <SupportInstanceKernel instance={instances[0]} />,
    );

    expect(
      await screen.findByRole("heading", { name: /kernel overview/i }),
    ).toBeInTheDocument();

    expect(container).toHaveInfoItem(
      "current kernel version",
      "5.4.0-100-generic",
    );

    expect(screen.getByText("Kernel upgrade available")).toBeInTheDocument();

    // The Livepatch fixes table, with every column the main tab lists.
    for (const column of ["CVE", "Status", "Description", "Bug"]) {
      expect(screen.getByText(column)).toBeInTheDocument();
    }

    for (const cve of ["cve-2013-1700", "cve-2013-1800", "cve-2013-1900"]) {
      expect(screen.getByText(cve)).toBeInTheDocument();
    }

    // Patched and unpatched states both surface as the main tab shows them.
    expect(screen.getByText("Patched by Livepatch")).toBeInTheDocument();
    expect(screen.getAllByText("Unpatched")).toHaveLength(2);
  });

  it("sorts the fixes by CVE when the column header is used", async () => {
    renderWithProviders(<SupportInstanceKernel instance={instances[0]} />);

    await screen.findByText("cve-2013-1700");

    const cveOrder = () =>
      screen
        .getAllByRole("link", { name: /^cve-/ })
        .map((link) => link.textContent);

    // The table opens sorted ascending by CVE, as the main tab does.
    expect(cveOrder()).toEqual([
      "cve-2013-1700",
      "cve-2013-1800",
      "cve-2013-1900",
    ]);

    await user.click(screen.getByRole("columnheader", { name: /CVE/i }));

    expect(cveOrder()).toEqual([
      "cve-2013-1900",
      "cve-2013-1800",
      "cve-2013-1700",
    ]);
  });

  it("offers no kernel action and reaches no mutation", async () => {
    renderWithProviders(<SupportInstanceKernel instance={instances[0]} />);

    await screen.findByRole("heading", { name: /kernel overview/i });

    for (const control of ACTION_CONTROLS) {
      expect(
        screen.queryByRole("button", { name: control }),
      ).not.toBeInTheDocument();
    }
  });

  it("shows an empty state when the instance has no kernel information", async () => {
    mockKernel({
      downgrades: [],
      installed: null,
      message: "Kernel information is not available for this instance.",
      smart_status: "",
      upgrades: [],
    });

    renderWithProviders(<SupportInstanceKernel instance={instances[0]} />);

    expect(
      await screen.findByText(
        "Kernel information is not available for this instance.",
      ),
    ).toBeInTheDocument();

    for (const control of ACTION_CONTROLS) {
      expect(
        screen.queryByRole("button", { name: control }),
      ).not.toBeInTheDocument();
    }
  });
});
