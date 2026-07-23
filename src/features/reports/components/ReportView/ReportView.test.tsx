import { API_URL } from "@/constants";
import { setSelectedInstanceIds } from "@/features/instances";
import usePageParams from "@/hooks/usePageParams";
import { setEndpointStatus } from "@/tests/controllers/controller";
import server from "@/tests/server";
import { complianceReport } from "@/tests/server/handlers/reports";
import { renderWithProviders } from "@/tests/render";
import { act, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { http, HttpResponse } from "msw";
import type { Mock } from "vitest";
import { beforeEach, describe, expect, it, vi } from "vitest";
import ReportView from "./ReportView";

vi.mock("@/hooks/usePageParams");

const instanceIds = [1, 2, 3];
// Ids not present in the report fixture, used to prove the report ignores the
// raw selection when deriving buckets.
const UNACCOUNTED_ID_A = 98;
const UNACCOUNTED_ID_B = 99;
// An id placed only in the 60-day bucket so the 30–60 slice has a member.
const THIRTY_SIXTY_ID = 17;
const ALL_SELECTED_STORE_ID_A = 999;
const ALL_SELECTED_STORE_ID_B = 1000;

describe("ReportView", () => {
  beforeEach(() => {
    setSelectedInstanceIds(instanceIds);
    (usePageParams as Mock).mockReturnValue({
      closeSidePanel: vi.fn(),
      createSidePathPusher: vi.fn(() => vi.fn()),
      lastSidePathSegment: undefined,
    });
  });

  it("shows a loading state while the report is fetched", () => {
    renderWithProviders(
      <ReportView selectedInstanceIds={instanceIds} isAllSelected={false} />,
    );
    expect(screen.getByRole("status")).toBeInTheDocument();
  });

  it("renders the status bar table with labels and counts", async () => {
    renderWithProviders(
      <ReportView selectedInstanceIds={instanceIds} isAllSelected={false} />,
    );

    const table = within(
      (await screen.findByText("Securely patched")).closest(
        "table",
      ) as HTMLElement,
    );
    expect(table.getByText("Upgrade profiles")).toBeInTheDocument();
    expect(table.getByText("Contacted in last 5 min")).toBeInTheDocument();
    expect(table.getByTestId("metric-bar-securely-patched")).toHaveStyle({
      width: `${(complianceReport.securely_patched.count / complianceReport.total) * 100}%`,
    });
    expect(
      table.getByRole("link", {
        name: "View the 7 securely patched instances",
      }),
    ).toBeInTheDocument();
  });

  it("renders disjoint patch time buckets, worst first", async () => {
    renderWithProviders(
      <ReportView selectedInstanceIds={instanceIds} isAllSelected={false} />,
    );

    await screen.findByText("Security upgrades");
    const legend = within(
      screen.getByText("60+ days outstanding").closest("table") as HTMLElement,
    );
    const labels = legend
      .getAllByRole("row")
      // Drop the header row.
      .slice(1)
      .map((row) => row.textContent);
    expect(labels[0]).toContain("60+ days");
    expect(labels[1]).toContain("30–60 days");
    expect(labels[2]).toContain("14–30 days");
    expect(labels[3]).toContain("2–14 days");
    expect(labels[4]).toContain("Within 2 days");
    expect(labels[5]).toContain("Other");

    // From the fixture: pending [7, 8, 9, 10, 16] wins over the cumulative
    // fixed_in buckets, leaving 4 within 2 days, 2 in 2-14 days, none in
    // the middle buckets, and one accounted-but-unclassified instance in Other.
    expect(
      legend.getByRole("link", {
        name: "View the 5 instances in the 60+ days outstanding bucket",
      }),
    ).toBeInTheDocument();
    expect(
      legend.getByRole("link", {
        name: "View the 4 instances in the Within 2 days bucket",
      }),
    ).toBeInTheDocument();
    expect(
      legend.getByRole("link", {
        name: "View the 2 instances in the 2–14 days bucket",
      }),
    ).toBeInTheDocument();
    expect(
      legend.getByRole("link", {
        name: "View the 1 instances in the Other bucket",
      }),
    ).toBeInTheDocument();
  });

  it("derives Other from the report's instances, not the raw selection", async () => {
    // A selection wider than the server-accounted set must not inflate Other
    // (and so must not push the donut's segments past 100%).
    renderWithProviders(
      <ReportView
        selectedInstanceIds={[
          1,
          2,
          3,
          4,
          5,
          6,
          7,
          8,
          9,
          10,
          16,
          UNACCOUNTED_ID_A,
          UNACCOUNTED_ID_B,
        ]}
        isAllSelected={false}
      />,
    );

    await screen.findByText("Security upgrades");
    const otherRow = screen.getByText("Other").closest("tr") as HTMLElement;
    const link = within(otherRow).getByRole("link", {
      name: "View the 1 instances in the Other bucket",
    });
    expect(link).toBeInTheDocument();
    expect(
      decodeURIComponent(link.getAttribute("href") ?? "").replace(/\+/g, " "),
    ).toContain("id:11");
  });

  it("renders no over-60-days arc when nothing is outstanding", async () => {
    server.use(
      http.get(`${API_URL}computers/report`, () =>
        HttpResponse.json({
          ...complianceReport,
          usn_pending_over_60_days: { count: 0, computer_ids: [] },
        }),
      ),
    );

    renderWithProviders(
      <ReportView selectedInstanceIds={instanceIds} isAllSelected={false} />,
    );

    await screen.findByText("Security upgrades");
    expect(screen.queryByTestId("donut-arc-over-60")).not.toBeInTheDocument();
  });

  it("shows an error notification when the report cannot be fetched", async () => {
    setEndpointStatus({ status: "error", path: "computers/report" });

    renderWithProviders(
      <ReportView selectedInstanceIds={instanceIds} isAllSelected={false} />,
    );

    expect(
      await screen.findByText(
        "Something went wrong. Please try again or contact our support team.",
      ),
    ).toBeInTheDocument();
    expect(screen.getByText("Error")).toBeInTheDocument();
  });

  it("shows when the report was generated", async () => {
    renderWithProviders(
      <ReportView selectedInstanceIds={instanceIds} isAllSelected={false} />,
    );
    expect(await screen.findByText(/Report generated/)).toBeInTheDocument();
  });

  it("deep-links the over-60-days bucket to its exact instances", async () => {
    const user = userEvent.setup();
    (usePageParams as Mock).mockReturnValue({
      closeSidePanel: vi.fn(),
      createSidePathPusher: vi.fn(() => vi.fn()),
      lastSidePathSegment: undefined,
    });
    const { closeSidePanel } = usePageParams();
    renderWithProviders(
      <ReportView selectedInstanceIds={instanceIds} isAllSelected={false} />,
    );

    const link = await screen.findByRole("link", {
      name: "View the 5 instances in the 60+ days outstanding bucket",
    });
    // The fixture's outstanding USN instances are ids 7, 8, 9, 10, 16.
    expect(
      decodeURIComponent(link.getAttribute("href") ?? "").replace(/\+/g, " "),
    ).toContain("id:7 OR id:8 OR id:9 OR id:10 OR id:16");

    await user.click(link);
    expect(closeSidePanel).toHaveBeenCalled();
  });

  it("uses allSelectedQuery when all results are selected", async () => {
    let capturedQuery: string | null = null;
    server.use(
      http.get(`${API_URL}computers/report`, ({ request }) => {
        capturedQuery = new URL(request.url).searchParams.get("query");
        return HttpResponse.json(complianceReport);
      }),
    );

    act(() => {
      setSelectedInstanceIds([
        ALL_SELECTED_STORE_ID_A,
        ALL_SELECTED_STORE_ID_B,
      ]);
    });

    renderWithProviders(
      <ReportView
        selectedInstanceIds={undefined}
        isAllSelected
        allSelectedQuery="tag:prod"
      />,
    );

    await screen.findByText("Security upgrades");

    expect(capturedQuery).toBe("tag:prod");
  });

  it("uses report total in header when all results are selected", async () => {
    act(() => {
      setSelectedInstanceIds([
        ALL_SELECTED_STORE_ID_A,
        ALL_SELECTED_STORE_ID_B,
      ]);
    });

    renderWithProviders(
      <ReportView
        selectedInstanceIds={undefined}
        isAllSelected
        allSelectedQuery="tag:prod"
      />,
    );

    await screen.findByText("Security upgrades");

    expect(
      screen.getByText(`Report for ${complianceReport.total} instances`),
    ).toBeInTheDocument();
  });

  it("shows no-selection warning at top while keeping full report view with zero instances", async () => {
    renderWithProviders(
      <ReportView selectedInstanceIds={[]} isAllSelected={false} />,
    );

    expect(
      screen.getByText("Select at least one instance to view a report."),
    ).toBeInTheDocument();
    expect(screen.getByText("Report for 0 instances")).toBeInTheDocument();
    expect(
      screen.getByRole("columnheader", { name: "Status" }),
    ).toBeInTheDocument();
    expect(
      screen.getByText("Security upgrades", { selector: "p" }),
    ).toBeInTheDocument();
  });

  it("deep-links a status row to its exact instances", async () => {
    renderWithProviders(
      <ReportView selectedInstanceIds={instanceIds} isAllSelected={false} />,
    );

    const link = await screen.findByRole("link", {
      name: "View the 7 securely patched instances",
    });
    // The fixture's securely patched instances are ids 1-6 and 11.
    expect(
      decodeURIComponent(link.getAttribute("href") ?? "").replace(/\+/g, " "),
    ).toContain("id:1 OR id:2 OR id:3 OR id:4 OR id:5 OR id:6 OR id:11");
  });

  it("deep-links a patch speed bucket to its exact instances", async () => {
    renderWithProviders(
      <ReportView selectedInstanceIds={instanceIds} isAllSelected={false} />,
    );

    const link = await screen.findByRole("link", {
      name: "View the 4 instances in the Within 2 days bucket",
    });
    // Within-2-days = fixed_in[2] (ids 1–4) minus the outstanding set.
    expect(
      decodeURIComponent(link.getAttribute("href") ?? "").replace(/\+/g, " "),
    ).toContain("id:1 OR id:2 OR id:3 OR id:4");
  });

  it("deep-links the 30–60 days bucket to its exact instances", async () => {
    // 30–60 days has no dedicated server bucket; the disjoint set is derived
    // client-side. Give the bucket a member so it renders a link.
    server.use(
      http.get(`${API_URL}computers/report`, () =>
        HttpResponse.json({
          ...complianceReport,
          usn_fixed_in: {
            ...complianceReport.usn_fixed_in,
            "60": {
              count: 9,
              computer_ids: [1, 2, 3, 4, 5, 6, 7, 8, THIRTY_SIXTY_ID],
            },
          },
        }),
      ),
    );
    renderWithProviders(
      <ReportView
        selectedInstanceIds={[...instanceIds, THIRTY_SIXTY_ID]}
        isAllSelected={false}
      />,
    );

    const link = await screen.findByRole("link", {
      name: "View the 1 instances in the 30–60 days bucket",
    });
    expect(
      decodeURIComponent(link.getAttribute("href") ?? "").replace(/\+/g, " "),
    ).toContain(`id:${THIRTY_SIXTY_ID}`);
  });

  it("keeps the snapshot but warns when the selection changes", async () => {
    renderWithProviders(
      <ReportView selectedInstanceIds={instanceIds} isAllSelected={false} />,
    );
    await screen.findByText("Security upgrades");

    expect(screen.queryByText("Selection has changed")).not.toBeInTheDocument();

    act(() => {
      setSelectedInstanceIds([1, 2]);
    });

    expect(screen.getByText("Selection has changed")).toBeInTheDocument();
    expect(
      screen.getByText(
        "This report still covers the 3 instances selected when it was generated.",
      ),
    ).toBeInTheDocument();
  });

  it("does not show selection changed notification on first render", async () => {
    renderWithProviders(
      <ReportView selectedInstanceIds={instanceIds} isAllSelected={false} />,
    );

    // Wait for report to load to ensure component is fully rendered
    await screen.findByText("Security upgrades");

    // Even though initial selection is [1,2,3], notification should NOT appear on first render
    expect(screen.queryByText("Selection has changed")).not.toBeInTheDocument();
  });

  it("regenerates the report for the new selection on demand", async () => {
    const user = userEvent.setup();
    (usePageParams as Mock).mockReturnValue({
      closeSidePanel: vi.fn(),
      createSidePathPusher: vi.fn(() => vi.fn()),
      lastSidePathSegment: undefined,
    });
    renderWithProviders(
      <ReportView selectedInstanceIds={instanceIds} isAllSelected={false} />,
    );
    await screen.findByText("Security upgrades");

    act(() => {
      setSelectedInstanceIds([1, 2]);
    });

    await user.click(screen.getByRole("button", { name: "Regenerate report" }));

    expect(screen.queryByText("Selection has changed")).not.toBeInTheDocument();
    expect(screen.getByText("Report for 2 instances")).toBeInTheDocument();
  });

  it("offers no regenerate action when the selection is empty", async () => {
    renderWithProviders(
      <ReportView selectedInstanceIds={instanceIds} isAllSelected={false} />,
    );
    await screen.findByText("Security upgrades");

    act(() => {
      setSelectedInstanceIds([]);
    });

    expect(screen.getByText("Selection has changed")).toBeInTheDocument();
    expect(
      screen.queryByRole("button", { name: "Regenerate report" }),
    ).not.toBeInTheDocument();
  });

  it("opens the export panel when Export as TSV is clicked", async () => {
    const mockCreateSidePathPusher = vi.fn(() => vi.fn());
    (usePageParams as Mock).mockReturnValue({
      closeSidePanel: vi.fn(),
      createSidePathPusher: mockCreateSidePathPusher,
      lastSidePathSegment: undefined,
    });
    renderWithProviders(
      <ReportView selectedInstanceIds={instanceIds} isAllSelected={false} />,
    );

    const exportButton = await screen.findByRole("button", {
      name: "Export as TSV",
    });
    exportButton.click();

    expect(mockCreateSidePathPusher).toHaveBeenCalledWith("export");
  });
});
