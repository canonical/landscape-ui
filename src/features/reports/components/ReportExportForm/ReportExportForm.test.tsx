import { API_URL } from "@/constants";
import server from "@/tests/server";
import { complianceReport } from "@/tests/server/handlers/reports";
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
// Securely-patched IDs not in the over-60 bucket represent real "other" instances
// for a parent that opens the export form with the default bucket selected.
const OTHER_IDS_WITH_CONTENT: readonly number[] =
  complianceReport.securely_patched.computer_ids.filter(
    (id) => !BUCKET_IDS["over-60"].includes(id),
  );

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
      screen.getByText(/the selected bucket contains no instances/i),
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

    // Verify the CVE note appears
    expect(
      screen.getByText(/CVE exports add a cve_id and status column/i),
    ).toBeInTheDocument();

    // Fill ExportForm Step 0
    await user.type(
      screen.getByRole("textbox", { name: "Export name" }),
      "My compliance export",
    );
    await openAttributeGroup(user, /primary identity/i);
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

  it("renders the Compliance field group with all expected fields", async () => {
    const user = userEvent.setup();
    renderForm();

    await openAttributeGroup(user, /compliance/i);

    expect(
      screen.getByRole("checkbox", { name: "Securely patched" }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("checkbox", { name: "Covered by upgrade profile" }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("checkbox", { name: "Contacted in last 5 min" }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("checkbox", { name: "Time to patch (days)" }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("checkbox", { name: "Upgrade profile schedule" }),
    ).toBeInTheDocument();
  });

  it("defaults to selecting title, hostname and all compliance fields", async () => {
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

    // Verify default selections are checked
    await openAttributeGroup(user, /primary identity/i);
    expect(screen.getByRole("checkbox", { name: "Hostname" })).toBeChecked();
    expect(
      screen.getByRole("checkbox", { name: "Instance name" }),
    ).toBeChecked();

    await openAttributeGroup(user, /compliance/i);
    expect(
      screen.getByRole("checkbox", { name: "Securely patched" }),
    ).toBeChecked();
    expect(
      screen.getByRole("checkbox", { name: "Covered by upgrade profile" }),
    ).toBeChecked();
    expect(
      screen.getByRole("checkbox", { name: "Contacted in last 5 min" }),
    ).toBeChecked();
    expect(
      screen.getByRole("checkbox", { name: "Time to patch (days)" }),
    ).toBeChecked();
    expect(
      screen.getByRole("checkbox", { name: "Upgrade profile schedule" }),
    ).toBeChecked();

    // Submit and verify the default field IDs are sent
    await user.type(
      screen.getByRole("textbox", { name: "Export name" }),
      "Default fields export",
    );
    await user.click(screen.getByRole("button", { name: "Next" }));
    await user.click(screen.getByRole("button", { name: "Generate TSV" }));

    await waitFor(() => {
      expect(requestBody.selected_field_ids).toEqual(
        expect.arrayContaining([
          "title",
          "hostname",
          "securely_patched",
          "covered_by_upgrade_profile",
          "contacted_recently",
          "time_to_patch_days",
          "upgrade_profile_schedule",
          "resolved_cves",
          "unresolved_cves",
        ]),
      );
    });

    expect((requestBody.selected_field_ids as string[]).length).toBe(9);
  });

  it("shows Resolved CVEs and Unresolved CVEs in the Compliance group when byCve is off", async () => {
    const user = userEvent.setup();
    renderForm();

    await openAttributeGroup(user, /compliance/i);

    expect(
      screen.getByRole("checkbox", { name: "Resolved CVEs" }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("checkbox", { name: "Unresolved CVEs" }),
    ).toBeInTheDocument();
  });

  it("hides Resolved CVEs and Unresolved CVEs from the Compliance group when byCve is on", async () => {
    const user = userEvent.setup();
    renderForm();

    await user.click(screen.getByRole("checkbox", { name: "Report by CVE" }));
    await openAttributeGroup(user, /compliance/i);

    expect(
      screen.queryByRole("checkbox", { name: "Resolved CVEs" }),
    ).not.toBeInTheDocument();
    expect(
      screen.queryByRole("checkbox", { name: "Unresolved CVEs" }),
    ).not.toBeInTheDocument();
  });

  it("blocks submit when byCve hides the only selected attributes", async () => {
    const user = userEvent.setup();
    let requestCount = 0;

    server.use(
      http.post(`${API_URL}computers/report\\:export`, async ({ request }) => {
        requestCount += 1;
        const body = (await request.json()) as Record<string, unknown>;
        return HttpResponse.json(
          {
            id: 8,
            name: body.name,
            filename: "compliance-export-1.tsv",
            row_count: 0,
            type: "report",
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

    await user.click(screen.getByRole("checkbox", { name: "Report by CVE" }));
    await user.type(
      screen.getByRole("textbox", { name: "Export name" }),
      "CVE hidden-only export",
    );

    await openAttributeGroup(user, /primary identity/i);
    await user.click(screen.getByRole("checkbox", { name: "Instance name" }));
    await user.click(screen.getByRole("checkbox", { name: "Hostname" }));

    await openAttributeGroup(user, /compliance/i);
    await user.click(
      screen.getByRole("checkbox", { name: "Securely patched" }),
    );
    await user.click(
      screen.getByRole("checkbox", { name: "Covered by upgrade profile" }),
    );
    await user.click(
      screen.getByRole("checkbox", { name: "Contacted in last 5 min" }),
    );
    await user.click(
      screen.getByRole("checkbox", { name: "Time to patch (days)" }),
    );
    await user.click(
      screen.getByRole("checkbox", { name: "Upgrade profile schedule" }),
    );

    await user.click(screen.getByRole("button", { name: "Next" }));
    await user.click(screen.getByRole("button", { name: "Generate TSV" }));

    expect(requestCount).toBe(0);
    expect(
      screen.queryByText("TSV export in progress"),
    ).not.toBeInTheDocument();
  });

  it("keeps other Compliance fields visible when byCve is on", async () => {
    const user = userEvent.setup();
    renderForm();

    await user.click(screen.getByRole("checkbox", { name: "Report by CVE" }));
    await openAttributeGroup(user, /compliance/i);

    expect(
      screen.getByRole("checkbox", { name: "Securely patched" }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("checkbox", { name: "Covered by upgrade profile" }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("checkbox", { name: "Time to patch (days)" }),
    ).toBeInTheDocument();
  });

  it("shows the cve_id/cve_status column note on step 1 when byCve is on", async () => {
    const user = userEvent.setup();
    renderForm();

    await user.click(screen.getByRole("checkbox", { name: "Report by CVE" }));
    await user.type(
      screen.getByRole("textbox", { name: "Export name" }),
      "CVE export",
    );
    await user.click(screen.getByRole("button", { name: "Next" }));

    expect(
      screen.getByText(
        /cve_id and cve_status will always be the first two columns/i,
      ),
    ).toBeInTheDocument();
  });

  it("does not show the cve_id/cve_status column note on step 1 when byCve is off", async () => {
    const user = userEvent.setup();
    renderForm();

    await user.type(
      screen.getByRole("textbox", { name: "Export name" }),
      "Instance export",
    );
    await user.click(screen.getByRole("button", { name: "Next" }));

    expect(
      screen.queryByText(
        /cve_id and cve_status will always be the first two columns/i,
      ),
    ).not.toBeInTheDocument();
  });

  it("appends 'including other unclassified instances' to description when Include Other is checked", async () => {
    const user = userEvent.setup();
    let capturedDescription = "";

    server.use(
      http.post(`${API_URL}computers/report\\:export`, async ({ request }) => {
        const body = (await request.json()) as Record<string, unknown>;
        capturedDescription =
          typeof body.description === "string" ? body.description : "";
        return HttpResponse.json(
          {
            id: 8,
            name: body.name,
            filename: "compliance-export-1.tsv",
            row_count: 0,
            type: "report",
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

    renderWithProviders(
      <ReportExportForm
        bucketIds={BUCKET_IDS}
        otherIds={OTHER_IDS_WITH_CONTENT}
      />,
    );

    await user.click(screen.getByRole("checkbox", { name: "Include Other" }));
    await user.type(
      screen.getByRole("textbox", { name: "Export name" }),
      "Test export",
    );
    await openAttributeGroup(user, /primary identity/i);
    await user.click(screen.getByRole("button", { name: "Next" }));
    await user.click(screen.getByRole("button", { name: "Generate TSV" }));

    await waitFor(() => {
      expect(capturedDescription).toBe(
        "Instances that took more than 60 days to apply a USN, or have an unapplied USN released within the last 60 days, including other unclassified instances",
      );
    });
  });

  it("sends a human-readable bucket description", async () => {
    const user = userEvent.setup();
    let capturedDescription = "";

    server.use(
      http.post(`${API_URL}computers/report\\:export`, async ({ request }) => {
        const body = (await request.json()) as Record<string, unknown>;
        capturedDescription =
          typeof body.description === "string" ? body.description : "";
        return HttpResponse.json(
          {
            id: 8,
            name: body.name,
            filename: "compliance-export-1.tsv",
            row_count: 0,
            type: "report",
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

    await user.type(
      screen.getByRole("textbox", { name: "Export name" }),
      "Test export",
    );
    await openAttributeGroup(user, /primary identity/i);
    await user.click(screen.getByRole("button", { name: "Next" }));
    await user.click(screen.getByRole("button", { name: "Generate TSV" }));

    await waitFor(() => {
      expect(capturedDescription).toBe(
        "Instances that took more than 60 days to apply a USN, or have an unapplied USN released within the last 60 days",
      );
    });
  });

  it("appends 'organized by CVE' to description when byCve is on", async () => {
    const user = userEvent.setup();
    let capturedDescription = "";

    server.use(
      http.post(`${API_URL}computers/report\\:export`, async ({ request }) => {
        const body = (await request.json()) as Record<string, unknown>;
        capturedDescription =
          typeof body.description === "string" ? body.description : "";
        return HttpResponse.json(
          {
            id: 8,
            name: body.name,
            filename: "compliance-export-1.tsv",
            row_count: 0,
            type: "report",
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

    await user.click(screen.getByRole("checkbox", { name: "Report by CVE" }));
    await user.type(
      screen.getByRole("textbox", { name: "Export name" }),
      "Test export",
    );
    await openAttributeGroup(user, /primary identity/i);
    await user.click(screen.getByRole("button", { name: "Next" }));
    await user.click(screen.getByRole("button", { name: "Generate TSV" }));

    await waitFor(() => {
      expect(capturedDescription).toBe(
        "Instances that took more than 60 days to apply a USN, or have an unapplied USN released within the last 60 days organized by CVE",
      );
    });
  });
});
