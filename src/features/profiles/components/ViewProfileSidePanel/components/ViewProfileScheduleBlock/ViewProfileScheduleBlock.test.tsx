/* eslint-disable @typescript-eslint/no-magic-numbers */
import { renderWithProviders } from "@/tests/render";
import { screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import ViewProfileScheduleBlock from "./ViewProfileScheduleBlock";
import { profiles } from "@/tests/mocks/profiles";

vi.mock("./helpers", () => ({
  getScheduleMessage: () => "Every Monday",
  getLastRunData: () => "2024-01-01T12:00:00Z",
  getNextRunData: () => "2024-01-02T12:00:00Z",
}));

const [baseProfile] = profiles;

describe("ViewProfileScheduleBlock", () => {
  it("renders trigger and last run for script profile", () => {
    const scriptProfile = {
      ...baseProfile,
      script_id: 1,
      trigger: {
        trigger_type: "one_time",
        next_run: "x",
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
    expect(screen.getByText(/Every Monday/i)).toBeInTheDocument();
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

  it("renders next restart for reboot profile", () => {
    const usgProfile = {
      ...baseProfile,
      next_run: "",
      schedule: "",
      deliver_within: 40,
      deliver_delay_window: 15,
      num_computers: 7,
    };

    renderWithProviders(<ViewProfileScheduleBlock profile={usgProfile} />);
    expect(
      screen.getByRole("heading", { name: /Running schedule/i }),
    ).toBeInTheDocument();
    expect(screen.getByText(/^Schedule$/i)).toBeInTheDocument();
    expect(screen.getByText(/Next restart/i)).toBeInTheDocument();

    expect(screen.queryByText(/Next run/i)).not.toBeInTheDocument();
    expect(screen.queryByText(/Restart schedule/i)).not.toBeInTheDocument();
    expect(
      screen.queryByText(/Delivery delay window/i),
    ).not.toBeInTheDocument();
    expect(screen.queryByText(/Last run/i)).not.toBeInTheDocument();
  });

  it("renders delivery delay window for upgrade profile", () => {
    const upgradeProfile = {
      ...baseProfile,
      upgrade_type: "all",
      at_minute: `${20}`,
      deliver_delay_window: `${30}`,
      every: "week",
      next_run: "string",
      at_hour: `${12}`,
      on_days: ["mo"],
    };

    renderWithProviders(<ViewProfileScheduleBlock profile={upgradeProfile} />);

    expect(
      screen.getByRole("heading", { name: /Running schedule/i }),
    ).toBeInTheDocument();
    expect(screen.getByText(/^Schedule$/i)).toBeInTheDocument();
    expect(screen.getByText(/Delivery delay window/i)).toBeInTheDocument();
    expect(screen.getByText(/Next run/i)).toBeInTheDocument();

    expect(screen.queryByText(/Restart schedule/i)).not.toBeInTheDocument();
    expect(screen.queryByText(/Last run/i)).not.toBeInTheDocument();
  });
});
