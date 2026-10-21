/* eslint-disable @typescript-eslint/no-magic-numbers */
import { renderWithProviders } from "@/tests/render";
import { screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import ViewProfileScheduleBlock from "./ViewProfileScheduleBlock";
import { profiles } from "@/tests/mocks/profiles";
import { NO_DATA_TEXT } from "@/components/layout/NoData";
import { usgProfiles } from "@/tests/mocks/usgProfiles";

const [baseProfile] = profiles;

describe("ViewProfileScheduleBlock", () => {
  it("renders trigger and last run for script profile", () => {
    const scriptProfile = {
      ...baseProfile,
      script_id: 30,
      username: "root",
      time_limit: 300,
      trigger: {
        trigger_type: "one_time",
        next_run: "2024-01-02T12:00:00Z",
        last_run: "y",
        timestamp: "z",
      },
      activities: { last_activity: { creation_time: "2024-01-01T12:00:00Z" } },
    };

    renderWithProviders(<ViewProfileScheduleBlock profile={scriptProfile} />);

    expect(
      screen.getByRole("heading", { name: /Running schedule/i }),
    ).toBeInTheDocument();
    expect(screen.getByText(/Trigger/i)).toBeInTheDocument();
    expect(screen.getByText(/On a date/i)).toBeInTheDocument();
    expect(screen.getByText(/Last run/i)).toBeInTheDocument();
    expect(screen.getByText(/Next run/i)).toBeInTheDocument();

    expect(screen.queryByText(/^Schedule$/i)).not.toBeInTheDocument();
    expect(
      screen.queryByText(/Delivery delay window/i),
    ).not.toBeInTheDocument();
  });

  it("renders last run for usg profile", () => {
    const usgProfile = {
      ...baseProfile,
      benchmark: "cis_level1_server",
      mode: "audit-fix",
      schedule: "FREQ=WEEKLY;INTERVAL=1;BYDAY=MO",
      restart_deliver_delay: 2,
      restart_deliver_delay_window: 30,
      next_run_time: "2024-01-02T12:00:00Z",
      last_run_results: { timestamp: "2024-01-01T12:00:00Z" },
      status: "active",
    };

    renderWithProviders(<ViewProfileScheduleBlock profile={usgProfile} />);

    expect(
      screen.getByRole("heading", { name: /Running schedule/i }),
    ).toBeInTheDocument();
    expect(screen.getByText(/^Schedule$/i)).toBeInTheDocument();
    expect(screen.getByText(/Last run/i)).toBeInTheDocument();
    expect(screen.getByText(/Next run/i)).toBeInTheDocument();
    expect(screen.getByText(/Jan 02, 2024, 12:00 UTC/i)).toBeInTheDocument();

    expect(screen.queryByText(/Restart schedule/i)).not.toBeInTheDocument();
    expect(
      screen.queryByText(/Delivery delay window/i),
    ).not.toBeInTheDocument();
  });

  it("renders restart schedule for audit-fix-restart security mode", () => {
    const usgProfile = {
      ...baseProfile,
      benchmark: "cis_level1_server",
      mode: "audit-fix-restart",
      schedule: "FREQ=WEEKLY;INTERVAL=1;BYDAY=MO",
      restart_deliver_delay: 2,
      restart_deliver_delay_window: 30,
      next_run_time: "2024-01-02T12:00:00Z",
      last_run_results: { timestamp: "2024-01-01T12:00:00Z" },
      status: "active",
    };

    renderWithProviders(<ViewProfileScheduleBlock profile={usgProfile} />);

    expect(screen.getByText(/Restart schedule/i)).toBeInTheDocument();
    expect(
      screen.getByText(
        /Delayed by 2 hours, randomize delivery over 30 minutes/i,
      ),
    ).toBeInTheDocument();
  });

  it.each([
    ["2026-12-31T05:00:00", "2026-12-30T04:00:00"],
    ["2026-12-31T05:00:00Z", "2026-12-30T04:00:00Z"],
    ["2026-12-31T14:00:00+09:00", "2026-12-30T13:00:00+09:00"],
  ])("displays USG API timestamps %s in UTC", (nextRun, lastRun) => {
    const usgProfile = {
      ...usgProfiles[1],
      next_run_time: nextRun,
      last_run_results: {
        ...usgProfiles[1].last_run_results,
        timestamp: lastRun,
      },
    };
    renderWithProviders(<ViewProfileScheduleBlock profile={usgProfile} />);

    expect(screen.getByText("Dec 31, 2026, 05:00 UTC")).toBeInTheDocument();
    expect(screen.getByText("Dec 30, 2026, 04:00 UTC")).toBeInTheDocument();
  });

  it("renders 'As soon as possible' restart schedule with no delay and no window", () => {
    const usgProfile = {
      ...baseProfile,
      benchmark: "cis_level1_server",
      mode: "audit-fix-restart",
      schedule: "FREQ=WEEKLY;INTERVAL=1;BYDAY=MO",
      restart_deliver_delay: 0,
      restart_deliver_delay_window: 0,
      next_run_time: "2024-01-02T12:00:00Z",
      last_run_results: { timestamp: "2024-01-01T12:00:00Z" },
      status: "active",
    };

    renderWithProviders(<ViewProfileScheduleBlock profile={usgProfile} />);

    expect(screen.getByText(/Restart schedule/i)).toBeInTheDocument();
    expect(screen.getByText("As soon as possible")).toBeInTheDocument();
    expect(screen.queryByText(/randomize delivery/i)).not.toBeInTheDocument();
  });

  it("renders NoData for missing last run and next run on a script profile", () => {
    const scriptProfile = {
      ...baseProfile,
      script_id: 30,
      username: "root",
      time_limit: 300,
      trigger: {
        trigger_type: "one_time",
        next_run: "",
        last_run: "",
        timestamp: "",
      },
      activities: { last_activity: null },
    };

    renderWithProviders(<ViewProfileScheduleBlock profile={scriptProfile} />);

    expect(screen.getByText(/Last run/i)).toBeInTheDocument();
    expect(screen.getByText(/Next run/i)).toBeInTheDocument();
    expect(screen.queryByText(/12:00 UTC/i)).not.toBeInTheDocument();
    expect(screen.getAllByText(NO_DATA_TEXT)).toHaveLength(2);
  });

  it("renders next restart for reboot profile", () => {
    const rebootProfile = {
      ...baseProfile,
      next_run: "2024-01-02T12:00:00Z",
      schedule: "FREQ=WEEKLY;BYDAY=MO;BYHOUR=12;BYMINUTE=0",
      deliver_within: 40,
      deliver_delay_window: 15,
      num_computers: 7,
    };

    renderWithProviders(<ViewProfileScheduleBlock profile={rebootProfile} />);
    expect(
      screen.getByRole("heading", { name: /Running schedule/i }),
    ).toBeInTheDocument();
    expect(screen.getByText(/^Schedule$/i)).toBeInTheDocument();
    expect(screen.getByText(/Monday at 12:00 UTC/i)).toBeInTheDocument();
    expect(screen.getByText(/Next restart/i)).toBeInTheDocument();

    expect(screen.queryByText(/Next run/i)).not.toBeInTheDocument();
    expect(screen.queryByText(/Restart schedule/i)).not.toBeInTheDocument();
    expect(
      screen.queryByText(/Delivery delay window/i),
    ).not.toBeInTheDocument();
    expect(screen.queryByText(/Last run/i)).not.toBeInTheDocument();
  });

  it("pads schedule time in reboot schedule", () => {
    const rebootProfile = {
      ...baseProfile,
      next_run: "2024-01-02T01:01:00Z",
      schedule: "FREQ=WEEKLY;BYDAY=MO;BYHOUR=1;BYMINUTE=1",
      deliver_within: 40,
      deliver_delay_window: 15,
      num_computers: 7,
    };

    renderWithProviders(<ViewProfileScheduleBlock profile={rebootProfile} />);

    expect(screen.getByText(/Monday at 01:01 UTC/i)).toBeInTheDocument();
  });

  it.each([
    {
      description: "missing hour",
      schedule: "FREQ=WEEKLY;BYDAY=MO,WE;BYMINUTE=15",
      expected: "Monday, Wednesday",
    },
    {
      description: "invalid hour",
      schedule: "FREQ=WEEKLY;BYDAY=MO,WE;BYHOUR=invalid;BYMINUTE=15",
      expected: "Monday, Wednesday",
    },
    {
      description: "missing hour and minute",
      schedule: "FREQ=WEEKLY;BYDAY=MO,WE",
      expected: "Monday, Wednesday",
    },
    {
      description: "missing minute",
      schedule: "FREQ=WEEKLY;BYDAY=MO;BYHOUR=1",
      expected: "Monday at 01:00 UTC",
    },
    {
      description: "invalid minute",
      schedule: "FREQ=WEEKLY;BYDAY=MO;BYHOUR=1;BYMINUTE=invalid",
      expected: "Monday at 01:00 UTC",
    },
    {
      description: "midnight with missing minute",
      schedule: "FREQ=WEEKLY;BYDAY=MO;BYHOUR=0",
      expected: "Monday at 00:00 UTC",
    },
  ])("renders reboot schedule with $description", ({ schedule, expected }) => {
    const rebootProfile = {
      ...baseProfile,
      next_run: "2024-01-02T12:00:00Z",
      schedule,
      deliver_within: 40,
      deliver_delay_window: 15,
      num_computers: 7,
    };

    renderWithProviders(<ViewProfileScheduleBlock profile={rebootProfile} />);

    expect(screen.getByText(expected, { exact: true })).toBeInTheDocument();
    expect(screen.queryByText(/NaN/)).not.toBeInTheDocument();
  });

  it("renders delivery delay window for upgrade profile", () => {
    const upgradeProfile = {
      ...baseProfile,
      upgrade_type: "all",
      autoremove: true,
      at_minute: `${20}`,
      deliver_delay_window: `${30}`,
      every: "week",
      next_run: "2024-01-02T12:00:00Z",
      at_hour: `${12}`,
      on_days: ["mo"],
    };

    renderWithProviders(<ViewProfileScheduleBlock profile={upgradeProfile} />);

    expect(
      screen.getByRole("heading", { name: /Running schedule/i }),
    ).toBeInTheDocument();
    expect(screen.getByText(/^Schedule$/i)).toBeInTheDocument();
    expect(screen.getByText(/Every Monday at 12:20 UTC/i)).toBeInTheDocument();
    expect(screen.getByText(/Delivery delay window/i)).toBeInTheDocument();
    expect(screen.getByText(/Next run/i)).toBeInTheDocument();

    expect(screen.queryByText(/Restart schedule/i)).not.toBeInTheDocument();
    expect(screen.queryByText(/Last run/i)).not.toBeInTheDocument();
  });
});
