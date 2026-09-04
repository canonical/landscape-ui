/* eslint-disable @typescript-eslint/no-magic-numbers */
import { INPUT_DATE_TIME_FORMAT } from "@/constants";
import date from "@/libs/date";
import type { NotificationHelper } from "@/types/Notification";
import { render } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { usgProfiles } from "@/tests/mocks/usgProfiles";
import {
  getDayOfWeek,
  getInitialValues,
  getNotificationMessage,
  getStatus,
  getTags,
  getTailoringFile,
  getUsgSchedule,
  notifyCreation,
  phrase,
} from "./helpers";
import type { USGProfile } from "./types";
import type { USGProfileFormValues } from "./types/USGProfileAddFormValues";

const baseProfile: USGProfile = {
  ...usgProfiles[0],
  tags: [...usgProfiles[0].tags],
};

const makeProfile = (overrides: Partial<USGProfile>): USGProfile => ({
  ...baseProfile,
  ...overrides,
});

const createNotify = () =>
  ({ success: vi.fn() }) as unknown as NotificationHelper;

describe("phrase", () => {
  it("returns an empty string for no items", () => {
    expect(phrase()).toBe("");
    expect(phrase([])).toBe("");
  });

  it("returns the single item unchanged", () => {
    expect(phrase(["one"])).toBe("one");
  });

  it("joins two items with 'and' and no comma", () => {
    expect(phrase(["one", "two"])).toBe("one and two");
  });

  it("joins three or more items with an Oxford comma", () => {
    expect(phrase(["one", "two", "three"])).toBe("one, two, and three");
  });
});

describe("notifyCreation", () => {
  it("notifies with an audit-only message", () => {
    const notify = createNotify();

    notifyCreation(
      { title: "Audit", mode: "audit" } as USGProfileFormValues,
      notify,
    );

    expect(notify.success).toHaveBeenCalledWith({
      title: "You have successfully created Audit USG profile.",
      message:
        "This profile will perform an initial run and generate an audit.",
    });
  });

  it("includes remediation for audit-fix mode", () => {
    const notify = createNotify();

    notifyCreation(
      { title: "Fix", mode: "audit-fix" } as USGProfileFormValues,
      notify,
    );

    expect(notify.success).toHaveBeenCalledWith({
      title: "You have successfully created Fix USG profile.",
      message:
        "This profile will perform an initial run, apply remediation fixes on associated instances, and generate an audit.",
    });
  });

  it("includes restart for audit-fix-restart mode", () => {
    const notify = createNotify();

    notifyCreation(
      { title: "Restart", mode: "audit-fix-restart" } as USGProfileFormValues,
      notify,
    );

    expect(notify.success).toHaveBeenCalledWith({
      title: "You have successfully created Restart USG profile.",
      message:
        "This profile will perform an initial run, apply remediation fixes on associated instances, restart them, and generate an audit.",
    });
  });
});

describe("getTags", () => {
  it("returns 'All instances' when profile targets all computers", () => {
    expect(getTags(makeProfile({ all_computers: true }))).toBe("All instances");
  });

  it("joins the tags when present", () => {
    expect(
      getTags(makeProfile({ all_computers: false, tags: ["a", "b"] })),
    ).toBe("a, b");
  });

  it("renders NoData when there are no tags", () => {
    const result = getTags(makeProfile({ all_computers: false, tags: [] }));
    const { container } = render(<>{result}</>);
    expect(container.textContent).toBe("---");
  });
});

describe("getTailoringFile", () => {
  it("renders NoData when there is no tailoring file", () => {
    const { container } = render(
      <>{getTailoringFile(makeProfile({ tailoring_file_uri: null }))}</>,
    );
    expect(container.textContent).toBe("---");
  });

  it("renders the file name and a download link", () => {
    const { container, getByRole } = render(
      <>
        {getTailoringFile(
          makeProfile({
            tailoring_file_uri: "https://example.com/files/hardening.xml",
          }),
        )}
      </>,
    );

    expect(container.textContent).toContain("hardening.xml");
    expect(getByRole("link")).toHaveAttribute(
      "href",
      "https://example.com/files/hardening.xml",
    );
  });

  it("falls back to a default name when the uri ends with a slash", () => {
    const { container } = render(
      <>
        {getTailoringFile(
          makeProfile({ tailoring_file_uri: "https://example.com/files/" }),
        )}
      </>,
    );
    expect(container.textContent).toContain("tailoring-file.xml");
  });
});

describe("getUsgSchedule", () => {
  it("returns 'On a date' for a single-run schedule", () => {
    expect(
      getUsgSchedule(makeProfile({ schedule: "FREQ=YEARLY;COUNT=1" })),
    ).toBe("On a date");
  });

  it("returns 'Recurring' in short mode", () => {
    expect(getUsgSchedule(makeProfile({ schedule: "FREQ=DAILY" }), true)).toBe(
      "Recurring",
    );
  });

  it("describes a daily schedule without an interval", () => {
    expect(getUsgSchedule(makeProfile({ schedule: "FREQ=DAILY" }))).toBe(
      "Recurring, every day",
    );
  });

  it("describes a daily schedule with an interval", () => {
    expect(
      getUsgSchedule(makeProfile({ schedule: "FREQ=DAILY;INTERVAL=7" })),
    ).toBe("Recurring, every 7 days");
  });

  it("describes a weekly schedule with days", () => {
    expect(
      getUsgSchedule(makeProfile({ schedule: "FREQ=WEEKLY;BYDAY=MO,WE" })),
    ).toBe("Recurring, every week on Monday and Wednesday");
  });

  it("describes a monthly schedule by month day", () => {
    expect(
      getUsgSchedule(makeProfile({ schedule: "FREQ=MONTHLY;BYMONTHDAY=15" })),
    ).toBe("Recurring, every month on the 15th day");
  });

  it("describes a monthly schedule by week day", () => {
    expect(
      getUsgSchedule(makeProfile({ schedule: "FREQ=MONTHLY;BYDAY=1MO" })),
    ).toBe("Recurring, every month on the first Monday");
  });

  it("describes a monthly schedule on the last week day", () => {
    expect(
      getUsgSchedule(makeProfile({ schedule: "FREQ=MONTHLY;BYDAY=-1FR" })),
    ).toBe("Recurring, every month on the last Friday");
  });

  it("omits the day part for a monthly schedule without a day rule", () => {
    expect(getUsgSchedule(makeProfile({ schedule: "FREQ=MONTHLY" }))).toBe(
      "Recurring, every month on the ",
    );
  });

  it("describes a yearly schedule with sorted months", () => {
    expect(
      getUsgSchedule(makeProfile({ schedule: "FREQ=YEARLY;BYMONTH=9,5" })),
    ).toBe("Recurring, every year in May and September");
  });

  it("appends an until clause when provided", () => {
    const result = getUsgSchedule(
      makeProfile({ schedule: "FREQ=DAILY;UNTIL=2024-12-31T00:00:00Z" }),
    );
    expect(result).toContain("Recurring, every day until");
    expect(result).toContain("Dec 31, 2024");
    expect(result).toContain("UTC");
  });
});

describe("getStatus", () => {
  it("returns the archived status", () => {
    expect(getStatus(makeProfile({ status: "archived" }))).toEqual({
      label: "Archived",
      icon: "status-queued-small",
    });
  });

  it("returns the active status", () => {
    expect(
      getStatus(makeProfile({ status: "active", associated_instances: 100 })),
    ).toEqual({
      label: "Active",
      icon: "status-succeeded-small",
    });
  });

  it("returns the over-limit status when past the instance limit", () => {
    const status = getStatus(
      makeProfile({ status: "active", associated_instances: 6000 }),
    );

    expect(status.icon).toBe("status-failed-small");
    const { container } = render(<>{status.label}</>);
    expect(container.textContent).toContain("Over limit");
  });
});

describe("getInitialValues", () => {
  it("maps a weekly recurring schedule", () => {
    const values = getInitialValues(
      makeProfile({
        schedule: "FREQ=WEEKLY;INTERVAL=2;BYDAY=MO,WE",
        next_run_time: "2024-05-15T15:47:07Z",
        restart_deliver_delay: 10,
        restart_deliver_delay_window: 20,
      }),
    );

    expect(values.unit_of_time).toBe("WEEKLY");
    expect(values.days).toEqual(["MO", "WE"]);
    expect(values.every).toBe("2");
    expect(values.start_type).toBe("recurring");
    expect(values.end_type).toBe("never");
    expect(values.delivery_time).toBe("delayed");
    expect(values.randomize_delivery).toBe(true);
    expect(values.deliver_delay_window).toBe(20);
    expect(values.tailoring_file).toBeNull();
    expect(values.start_date).toBe(
      date("2024-05-15T15:47:07Z").format(INPUT_DATE_TIME_FORMAT),
    );
  });

  it("maps a monthly by-week-day schedule", () => {
    const values = getInitialValues(
      makeProfile({ schedule: "FREQ=MONTHLY;BYDAY=1MO" }),
    );

    expect(values.day_of_month_type).toBe("day-of-week");
  });

  it("maps a monthly by-month-day schedule", () => {
    const values = getInitialValues(
      makeProfile({ schedule: "FREQ=MONTHLY;BYMONTHDAY=15" }),
    );

    expect(values.day_of_month_type).toBe("day-of-month");
  });

  it("maps a yearly schedule with months", () => {
    const values = getInitialValues(
      makeProfile({ schedule: "FREQ=YEARLY;BYMONTH=5,9" }),
    );

    expect(values.months).toEqual([5, 9]);
  });

  it("maps an end date when the schedule has an until clause", () => {
    const values = getInitialValues(
      makeProfile({ schedule: "FREQ=DAILY;UNTIL=2024-12-31T00:00:00Z" }),
    );

    expect(values.end_type).toBe("on-a-date");
    expect(values.end_date).toBe(
      date("2024-12-31T00:00:00Z").format(INPUT_DATE_TIME_FORMAT),
    );
  });

  it("uses asap delivery and no randomization without delays", () => {
    const values = getInitialValues(
      makeProfile({
        schedule: "FREQ=DAILY",
        next_run_time: "2024-05-15T15:47:07Z",
        restart_deliver_delay: 0,
        restart_deliver_delay_window: 0,
      }),
    );

    expect(values.delivery_time).toBe("asap");
    expect(values.randomize_delivery).toBe(false);
  });

  it("marks a single-run schedule as on-a-date", () => {
    const values = getInitialValues(
      makeProfile({
        schedule: "FREQ=YEARLY;COUNT=1",
        next_run_time: "2024-05-15T15:47:07Z",
      }),
    );

    expect(values.start_type).toBe("on-a-date");
  });

  it("falls back to the last run timestamp and a daily unit", () => {
    const values = getInitialValues(
      makeProfile({
        schedule: "INTERVAL=1",
        next_run_time: null,
        last_run_results: {
          ...baseProfile.last_run_results,
          timestamp: "2024-05-15T15:47:07Z",
        },
      }),
    );

    expect(values.unit_of_time).toBe("DAILY");
    expect(values.start_date).toBe(
      date("2024-05-15T15:47:07Z").format(INPUT_DATE_TIME_FORMAT),
    );
  });
});

describe("getNotificationMessage", () => {
  it("returns the fix message for audit-fix mode", () => {
    expect(getNotificationMessage("audit-fix")).toBe(
      "Applying remediation fixes and generating an audit have been queued in Activities.",
    );
  });

  it("returns the restart message for audit-fix-restart mode", () => {
    expect(getNotificationMessage("audit-fix-restart")).toBe(
      "Applying remediation fixes, restarting associated instances, and generating an audit have been queued in Activities.",
    );
  });

  it("returns the restart message for audit mode", () => {
    expect(getNotificationMessage("audit")).toBe(
      "Applying remediation fixes, restarting associated instances, and generating an audit have been queued in Activities.",
    );
  });
});

describe("getDayOfWeek", () => {
  it("returns the zero-based day index for a date", () => {
    expect(getDayOfWeek(new Date(2024, 4, 15))).toBe(3);
    expect(getDayOfWeek(new Date(2024, 4, 12))).toBe(0);
  });
});
