import { DISPLAY_DATE_FORMAT } from "@/constants";
import moment from "moment";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import {
  getLivepatchCoverageDisplayValue,
  getLivepatchCoverageIcon,
  getStatusIcon,
  getStatusTooltipMessage,
} from "./helpers";

const NOW = new Date("2026-04-02T12:00:00Z");
const TWO_DAYS = 2;
const TEN_DAYS = 10;

describe("KernelOverview helpers", () => {
  beforeEach(() => {
    vi.useFakeTimers();
    vi.setSystemTime(NOW);
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it("builds upgrade tooltip with formatted expiry date when valid", () => {
    const expiry = "2026-04-12T00:00:00Z";

    expect(
      getStatusTooltipMessage("Kernel upgrade available", expiry),
    ).toContain(
      `covered by Livepatch until ${moment(expiry).format(DISPLAY_DATE_FORMAT)}`,
    );
  });

  it("omits expiry details for invalid kernel-upgrade dates", () => {
    expect(
      getStatusTooltipMessage("Kernel upgrade available", "bad-date"),
    ).toBe("A new kernel version is available.");
  });

  it("returns status icons for known and unknown statuses", () => {
    expect(getStatusIcon("Patched by Livepatch")).toBe(
      "status-succeeded-small",
    );
    expect(getStatusIcon("Fully patched")).toBe("status-succeeded-small");
    expect(getStatusIcon("Kernel upgrade available")).toBe(
      "status-succeeded-small",
    );
    expect(getStatusIcon("Restart required")).toBe("status-waiting-small");
    expect(getStatusIcon("End of life")).toBe("status-failed-small");
    expect(getStatusIcon("Unknown")).toBe("status-failed-small");
  });

  it("returns tooltip messages for all non-upgrade statuses and unknown states", () => {
    expect(getStatusTooltipMessage("Fully patched", "")).toBe(
      "All available kernel security patches have been applied. You have no pending patches.",
    );
    expect(getStatusTooltipMessage("Restart required", "")).toBe(
      "Low and/or medium patches have been installed. You must restart to complete patching.",
    );
    expect(getStatusTooltipMessage("End of life", "")).toBe(
      "The kernel is no longer covered by Livepatch. It is not getting high and critical security patches.",
    );
    expect(getStatusTooltipMessage("Livepatch disabled", "")).toBe(
      "Livepatch is disabled. Kernel patches will not be applied automatically until you enabled Livepatch.",
    );
    expect(getStatusTooltipMessage("Unexpected", "")).toBe(
      "There was an error getting the status.",
    );
  });

  it("computes livepatch coverage icons by enablement and expiry window", () => {
    const soonExpiry = moment(NOW).add(TWO_DAYS, "days").toISOString();
    const laterExpiry = moment(NOW).add(TEN_DAYS, "days").toISOString();
    const expired = moment(NOW).subtract(1, "day").toISOString();

    expect(getLivepatchCoverageIcon(true, soonExpiry)).toBe(
      "status-waiting-small",
    );
    expect(getLivepatchCoverageIcon(true, laterExpiry)).toBe(
      "status-succeeded-small",
    );
    expect(getLivepatchCoverageIcon(true, expired)).toBe("status-failed-small");
    expect(getLivepatchCoverageIcon(false, laterExpiry)).toBe(
      "status-failed-small",
    );
    expect(getLivepatchCoverageIcon(true, "not-a-date")).toBe(
      "status-failed-small",
    );
  });

  it("computes display value for disabled, expired, and active coverage", () => {
    const laterExpiry = moment(NOW).add(TEN_DAYS, "days").toISOString();
    const expired = moment(NOW).subtract(1, "day").toISOString();

    expect(getLivepatchCoverageDisplayValue(false, laterExpiry)).toBe(
      "Livepatch is disabled",
    );
    expect(getLivepatchCoverageDisplayValue(true, expired)).toBe("Expired");
    expect(getLivepatchCoverageDisplayValue(true, laterExpiry)).toBe(
      `Expires on ${moment(laterExpiry).format(DISPLAY_DATE_FORMAT)}`,
    );
  });
});
