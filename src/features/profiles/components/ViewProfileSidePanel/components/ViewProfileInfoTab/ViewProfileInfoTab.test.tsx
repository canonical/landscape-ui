import { renderWithProviders } from "@/tests/render";
import { screen } from "@testing-library/react";
import { Suspense } from "react";
import { describe, expect, it } from "vitest";
import ViewProfileInfoTab from "./ViewProfileInfoTab";
import { ProfileTypes } from "../../../../helpers";
import { profiles } from "@/tests/mocks/profiles";
import LoadingState from "@/components/layout/LoadingState";

const [profile] = profiles;

describe("ViewProfileInfoTab", () => {
  it("renders the schedule block for script profiles", async () => {
    renderWithProviders(
      <Suspense fallback={<LoadingState />}>
        <ViewProfileInfoTab
          profile={{
            ...profile,
            all_computers: true,
            computers: { num_associated_computers: 3 },
            script_id: 30,
            username: "root",
            time_limit: 300,
            trigger: {
              trigger_type: "one_time",
              next_run: "2024-01-02T12:00:00Z",
              last_run: "y",
              timestamp: "z",
            },
            activities: {
              last_activity: { creation_time: "2024-01-01T12:00:00Z" },
            },
          }}
          type={ProfileTypes.script}
        />
      </Suspense>,
    );

    expect(await screen.findByText("General")).toBeInTheDocument();
    expect(await screen.findByText("Details")).toBeInTheDocument();
    expect(await screen.findByText("Association")).toBeInTheDocument();
    expect(await screen.findByText("Running schedule")).toBeInTheDocument();
  });

  it("does not render the schedule block for removal profiles", async () => {
    renderWithProviders(
      <Suspense fallback={<LoadingState />}>
        <ViewProfileInfoTab
          profile={{
            ...profile,
            all_computers: true,
            computers: { num_associated_computers: 2 },
            days_without_exchange: 30,
          }}
          type={ProfileTypes.removal}
        />
      </Suspense>,
    );

    expect(await screen.findByText("General")).toBeInTheDocument();
    expect(await screen.findByText("Details")).toBeInTheDocument();
    expect(await screen.findByText("Association")).toBeInTheDocument();
    expect(screen.queryByText("Running schedule")).not.toBeInTheDocument();
  });

  it("omits the details block for reboot profiles", async () => {
    renderWithProviders(
      <Suspense fallback={<LoadingState />}>
        <ViewProfileInfoTab
          profile={{
            ...profile,
            all_computers: true,
            next_run: "2024-01-02T12:00:00Z",
            schedule: "FREQ=WEEKLY;BYDAY=MO;BYHOUR=12;BYMINUTE=20",
            deliver_within: 40,
            deliver_delay_window: 15,
            num_computers: 7,
          }}
          type={ProfileTypes.reboot}
        />
      </Suspense>,
    );

    expect(await screen.findByText("General")).toBeInTheDocument();
    expect(await screen.findByText("Association")).toBeInTheDocument();
    expect(await screen.findByText("Running schedule")).toBeInTheDocument();
    expect(screen.queryByText("Details")).not.toBeInTheDocument();
  });

  it("omits details and schedule blocks for repository profiles", async () => {
    renderWithProviders(
      <Suspense fallback={<LoadingState />}>
        <ViewProfileInfoTab
          profile={{
            ...profile,
            all_computers: true,
            apt_sources: [],
          }}
          type={ProfileTypes.repository}
        />
      </Suspense>,
    );

    expect(await screen.findByText("General")).toBeInTheDocument();
    expect(await screen.findByText("Association")).toBeInTheDocument();
    expect(screen.queryByText("Details")).not.toBeInTheDocument();
    expect(screen.queryByText("Running schedule")).not.toBeInTheDocument();
  });
});
