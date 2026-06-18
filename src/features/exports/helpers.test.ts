import { describe, it, expect } from "vitest";
import {
  hasProcessingExportJobs,
  getStatusLabel,
  getTypeLabel,
} from "./helpers";
import {
  completedExportJob,
  completedActivitiesExportJob,
  failedExportJob,
  processingExportJob,
} from "@/tests/mocks/exports";

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
});
