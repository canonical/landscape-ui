import { describe, it, expect } from "vitest";
import { getStatusIcon, getTypeIcon } from "./helpers";
import {
  completedExportJob,
  completedActivitiesExportJob,
  failedActivitiesExportJob,
  processingExportJob,
} from "@/tests/mocks/exports";

describe("getStatusIcon", () => {
  it('returns "status-succeeded-small" for completed', () => {
    expect(getStatusIcon(completedExportJob)).toBe("status-succeeded-small");
  });

  it('returns "status-failed-small" for failed', () => {
    expect(getStatusIcon(failedActivitiesExportJob)).toBe("status-failed-small");
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
    expect(getTypeIcon(completedActivitiesExportJob)).toBe("switcher-environments");
  });
});
