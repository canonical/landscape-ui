import { API_URL } from "@/constants";
import server from "@/tests/server";
import { renderWithProviders } from "@/tests/render";
import { screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { http, HttpResponse } from "msw";
import { describe, expect, it } from "vitest";
import ReportExportForm from "./ReportExportForm";
import type { BucketKey } from "./constants";

// Bucket ID arrays derived from the complianceReport fixture in
// src/tests/server/handlers/reports.ts, matching the disjoint set logic in
// ReportView so the test props are consistent with what a real parent passes.
const BUCKET_IDS: Record<BucketKey, readonly number[]> = {
  "over-60": [7, 8, 9, 10, 16],
  "30-60": [],
  "14-30": [],
  "2-14": [5, 6],
  "within-2": [1, 2, 3, 4],
};
const OTHER_IDS: readonly number[] = [];

const renderForm = () =>
  renderWithProviders(
    <ReportExportForm bucketIds={BUCKET_IDS} otherIds={OTHER_IDS} />,
  );

const openAttributeGroup = async (
  user: ReturnType<typeof userEvent.setup>,
  name: RegExp,
) => {
  await user.click(screen.getByRole("tab", { name }));
};

describe("ReportExportForm", () => {
  it("renders the bucket selector, Include Other, Report by CVE and the ExportForm shell", () => {
    renderForm();

    expect(screen.getByRole("combobox", { name: "Bucket" })).toBeVisible();
    expect(
      screen.getByRole("checkbox", { name: "Include Other" }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("checkbox", { name: "Report by CVE" }),
    ).toBeInTheDocument();
    // ExportForm Step 0 content
    expect(
      screen.getByRole("textbox", { name: "Export name" }),
    ).toBeInTheDocument();
    expect(screen.getByLabelText("Keep until")).toBeInTheDocument();
  });

  it("defaults to the 60+ days outstanding bucket", () => {
    renderForm();

    expect(screen.getByRole("combobox", { name: "Bucket" })).toHaveValue(
      "over-60",
    );
  });

  it("shows the empty-bucket validation message when the selected bucket has no instances", async () => {
    const user = userEvent.setup();
    renderForm();

    // Switch to a bucket with no instances in the fixture
    const select = screen.getByRole("combobox", { name: "Bucket" });
    await user.selectOptions(select, "30-60");

    expect(
      screen.getByText(
        /the selected bucket contains no instances/i,
      ),
    ).toBeInTheDocument();
  });

  it("hides the empty-bucket message when Include Other is ticked for an empty bucket", async () => {
    const user = userEvent.setup();
    renderForm();

    const select = screen.getByRole("combobox", { name: "Bucket" });
    await user.selectOptions(select, "30-60");

    expect(
      screen.getByText(/the selected bucket contains no instances/i),
    ).toBeInTheDocument();

    await user.click(screen.getByRole("checkbox", { name: "Include Other" }));

    // OTHER_IDS is empty in our fixture too, so the message should still show —
    // both the bucket and Other are empty.
    expect(
      screen.getByText(/the selected bucket contains no instances/i),
    ).toBeInTheDocument();
  });

  it("does not show the empty-bucket message for the default populated bucket", () => {
    renderForm();

    expect(
      screen.queryByText(/the selected bucket contains no instances/i),
    ).not.toBeInTheDocument();
  });

  it("submits with the correct query, by_cve and field ids and shows the success toast", async () => {
    const user = userEvent.setup();
    let requestBody: Record<string, unknown> = {};

    server.use(
      http.post(`${API_URL}computers/report\\:export`, async ({ request }) => {
        requestBody = (await request.json()) as Record<string, unknown>;
        return HttpResponse.json(
          {
            id: 8,
            name: requestBody.name,
            filename: "compliance-export-1.tsv",
            row_count: 0,
            type: "instance",
            created_at: new Date().toISOString(),
            status: "processing",
            progress: 0,
            download_ready: false,
            retain_until: requestBody.retain_until,
            query: requestBody.query,
          },
          { status: 201 },
        );
      }),
    );

    renderForm();

    // Enable by_cve
    await user.click(screen.getByRole("checkbox", { name: "Report by CVE" }));

    // Fill ExportForm Step 0
    await user.type(
      screen.getByRole("textbox", { name: "Export name" }),
      "My compliance export",
    );
    await openAttributeGroup(user, /primary identity/i);
    await user.click(screen.getByRole("checkbox", { name: "Hostname" }));
    await user.click(screen.getByRole("button", { name: "Next" }));

    // Step 1 — submit
    await user.click(screen.getByRole("button", { name: "Generate TSV" }));

    await waitFor(() => {
      expect(requestBody.by_cve).toBe(true);
    });

    // Query built from the default "over-60" bucket IDs
    expect(requestBody.query).toBe("id:7 OR id:8 OR id:9 OR id:10 OR id:16");
    expect(requestBody.name).toBe("My compliance export");
    expect(requestBody.selected_field_ids).toContain("hostname");

    expect(
      await screen.findByText("TSV export in progress"),
    ).toBeInTheDocument();
    expect(
      screen.getByText(/Your compliance export "My compliance export"/),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: "View export status" }),
    ).toBeInTheDocument();
  });

  it("builds the query from the selected bucket's instance IDs", async () => {
    const user = userEvent.setup();
    let capturedQuery = "";

    server.use(
      http.post(`${API_URL}computers/report\\:export`, async ({ request }) => {
        const body = (await request.json()) as Record<string, unknown>;
        capturedQuery = typeof body.query === "string" ? body.query : "";
        return HttpResponse.json(
          {
            id: 8,
            name: body.name,
            filename: "compliance-export-1.tsv",
            row_count: 0,
            type: "instance",
            created_at: new Date().toISOString(),
            status: "processing",
            progress: 0,
            download_ready: false,
            retain_until: body.retain_until,
            query: body.query,
          },
          { status: 201 },
        );
      }),
    );

    renderForm();

    // Switch to the within-2 bucket
    await user.selectOptions(
      screen.getByRole("combobox", { name: "Bucket" }),
      "within-2",
    );

    await user.type(
      screen.getByRole("textbox", { name: "Export name" }),
      "Within 2 days export",
    );
    await openAttributeGroup(user, /primary identity/i);
    await user.click(screen.getByRole("checkbox", { name: "Hostname" }));
    await user.click(screen.getByRole("button", { name: "Next" }));
    await user.click(screen.getByRole("button", { name: "Generate TSV" }));

    await waitFor(() => {
      expect(capturedQuery).toBe("id:1 OR id:2 OR id:3 OR id:4");
    });
  });
});
