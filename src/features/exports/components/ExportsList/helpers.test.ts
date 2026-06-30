import { describe, it, expect } from "vitest";
import { getStatusIcon, getTypeIcon } from "./helpers";
import {
  completedExportJob,
  completedActivitiesExportJob,
  failedActivitiesExportJob,
  processingExportJob,
  newComplianceExportJob,
} from "@/tests/mocks/exports";

describe("getStatusIcon", () => {
  it('returns "success" for completed', () => {
    expect(getStatusIcon(completedExportJob)).toBe("success");
  });

  it('returns "error" for failed', () => {
    expect(getStatusIcon(failedActivitiesExportJob)).toBe("error");
  });

  it('returns "status-in-progress-small" for processing', () => {
    expect(getStatusIcon(processingExportJob)).toBe("status-in-progress-small");
  });
});

describe("getTypeIcon", () => {
  it('returns "machines" for instance exports', () => {
    expect(getTypeIcon(completedExportJob)).toBe("machines");
  });

  it('returns "switcher-environments" for activity exports', () => {
    expect(getTypeIcon(completedActivitiesExportJob)).toBe(
      "switcher-environments",
    );
  });

  it('returns "documents" for report exports', () => {
    expect(getTypeIcon(newComplianceExportJob)).toBe("documents");
  });
});
