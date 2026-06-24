import { describe, it, expect } from "vitest";
import {
  buildExportQuery,
  hasProcessingExportJobs,
  getExportScope,
  getStatusLabel,
  getTypeLabel,
} from "./helpers";
import {
  completedExportJob,
  completedActivitiesExportJob,
  failedExportJob,
  processingExportJob,
  newComplianceExportJob,
} from "@/tests/mocks/exports";

describe("buildExportQuery", () => {
  const FIRST_ID = 11;
  const SECOND_ID = 42;

  it("returns the trimmed query when there is no selection", () => {
    expect(buildExportQuery({ query: "  name:prod  ", selectedIds: [] })).toBe(
      "name:prod",
    );
  });

  it("returns an empty string when there is no query or selection", () => {
    expect(buildExportQuery({})).toBe("");
  });

  it("builds an id-only query when there is no base query", () => {
    expect(buildExportQuery({ selectedIds: [1, 2, 3] })).toBe(
      "id:1 OR id:2 OR id:3",
    );
  });

  it("uses only the selected ids when both a query and ids are provided", () => {
    expect(
      buildExportQuery({
        query: "tag:server archived:false",
        selectedIds: [FIRST_ID, SECOND_ID],
      }),
    ).toBe(`id:${FIRST_ID} OR id:${SECOND_ID}`);
  });
});

describe("getExportScope", () => {
  const selectionForms = ["selected activity", "selected activities"] as const;

  it("uses the selected item count instead of the query", () => {
    expect(
      getExportScope({
        query: "status:succeeded",
        selectedCount: 2,
        selectionForms,
      }),
    ).toBe(" for 2 selected activities");
  });

  it("uses the singular selection label", () => {
    expect(getExportScope({ selectedCount: 1, selectionForms })).toBe(
      " for 1 selected activity",
    );
  });

  it("uses the query when there is no selection", () => {
    expect(getExportScope({ query: "status:succeeded", selectionForms })).toBe(
      ' for "status:succeeded"',
    );
  });

  it("returns an empty scope when there is no selection or query", () => {
    expect(getExportScope({ selectionForms })).toBe("");
  });
});

describe("hasProcessingExportJobs", () => {
  it("returns true when any job is processing", () => {
    expect(
      hasProcessingExportJobs([processingExportJob, completedExportJob]),
    ).toBe(true);
  });

  it("returns false when no jobs are processing", () => {
    expect(hasProcessingExportJobs([completedExportJob, failedExportJob])).toBe(
      false,
    );
  });

  it("returns false for an empty list", () => {
    expect(hasProcessingExportJobs([])).toBe(false);
  });
});

describe("getStatusLabel", () => {
  it('returns "Ready" for completed jobs', () => {
    expect(getStatusLabel(completedExportJob)).toBe("Ready");
  });

  it('returns "Failed" for failed jobs', () => {
    expect(getStatusLabel(failedExportJob)).toBe("Failed");
  });

  it("returns progress percentage for processing jobs", () => {
    expect(getStatusLabel(processingExportJob)).toBe("Generating (35%)");
  });
});

describe("getTypeLabel", () => {
  it('returns "Instances" for instance exports', () => {
    expect(getTypeLabel(completedExportJob)).toBe("Instances");
  });

  it('returns "Activities" for activity exports', () => {
    expect(getTypeLabel(completedActivitiesExportJob)).toBe("Activities");
  });

  it('returns "Reports" for report exports', () => {
    expect(getTypeLabel(newComplianceExportJob)).toBe("Reports");
  });
});
