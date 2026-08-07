import type { Activity } from "@/features/activities";
import type { USGProfile } from "@/features/usg-profiles";
import { setEndpointStatus } from "@/tests/controllers/controller";
import { getLocationDisplay, LocationDisplay } from "@/tests/LocationDisplay";
import { usgProfiles } from "@/tests/mocks/usgProfiles";
import { renderWithProviders } from "@/tests/render";
import { screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import USGProfilesNotifications from "./USGProfilesNotifications";

const PENDING_REPORTS_KEY = "_landscape_pendingSecurityProfileReports";

const baseActivity: Activity = {
  activity_status: "succeeded",
  approval_time: null,
  children: [],
  completion_time: null,
  computer_id: 0,
  creation_time: "",
  creator: { email: "", id: 0, name: "" },
  deliver_after_time: null,
  deliver_before_time: null,
  delivery_time: null,
  id: 0,
  modification_time: "",
  parent_id: null,
  result_code: null,
  result_text: null,
  schedule_after_time: null,
  schedule_before_time: null,
  summary: "",
  type: "",
};

const overLimitProfile = (overrides: Partial<USGProfile>): USGProfile => ({
  ...(usgProfiles[1] as USGProfile),
  status: "active",
  associated_instances: 6000,
  ...overrides,
});

const succeededActivity = (overrides: Partial<Activity>): Activity => ({
  ...baseActivity,
  ...overrides,
});

const useEndpointStatuses = ({
  profiles = [],
  activities = [],
}: {
  profiles?: USGProfile[];
  activities?: Activity[];
}) => {
  setEndpointStatus([
    { status: "variant", path: "usg-profiles", response: profiles },
    { status: "variant", path: "activities", response: activities },
  ]);
};

describe("USGProfilesNotifications", () => {
  beforeEach(() => {
    localStorage.clear();
    setEndpointStatus("default");
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it("renders the retention notification when visible", async () => {
    renderWithProviders(
      <USGProfilesNotifications
        isRetentionNotificationVisible
        hideRetentionNotification={vi.fn()}
      />,
    );

    expect(screen.getByText("Audit retention policy:")).toBeInTheDocument();
    expect(
      screen.queryByRole("heading", {
        name: "Your audit is ready for download:",
      }),
    ).not.toBeInTheDocument();
  });

  it("shows single-profile notifications, downloads the audit, and dismisses it", async () => {
    localStorage.setItem(
      PENDING_REPORTS_KEY,
      JSON.stringify([{ activityId: 100, profileId: 1 }]),
    );
    useEndpointStatuses({
      profiles: [overLimitProfile({ id: 1, title: "Over limit profile" })],
      activities: [
        succeededActivity({ id: 100, result_text: "audits/report-100.csv" }),
      ],
    });

    const anchorClick = vi
      .spyOn(HTMLAnchorElement.prototype, "click")
      .mockImplementation(() => undefined);

    renderWithProviders(
      <>
        <USGProfilesNotifications
          isRetentionNotificationVisible={false}
          hideRetentionNotification={vi.fn()}
        />
        <LocationDisplay />
      </>,
      undefined,
      "/usg-profiles",
    );

    expect(
      await screen.findByRole("heading", {
        name: "Your audit is ready for download:",
      }),
    ).toBeInTheDocument();
    expect(
      await screen.findByRole("heading", {
        name: "Profile exceeded associated instance limit:",
      }),
    ).toBeInTheDocument();
    expect(screen.getByText("Over limit profile")).toBeInTheDocument();

    await userEvent.click(
      screen.getByRole("button", { name: "Download audit" }),
    );
    await waitFor(() => {
      expect(anchorClick).toHaveBeenCalledOnce();
    });

    await userEvent.click(screen.getByRole("button", { name: "Edit profile" }));
    await waitFor(() => {
      expect(getLocationDisplay()).toHaveTextContent("sidePath=edit");
    });
    expect(getLocationDisplay()).toHaveTextContent("name=1");

    await userEvent.click(
      screen.getByRole("button", { name: "Close notification" }),
    );

    await waitFor(() => {
      expect(
        screen.queryByRole("heading", {
          name: "Your audit is ready for download:",
        }),
      ).not.toBeInTheDocument();
    });
    expect(localStorage.getItem(PENDING_REPORTS_KEY)).toBeNull();
  });

  it("shows multi-profile notifications, downloads all audits, navigates, and dismisses", async () => {
    localStorage.setItem(
      PENDING_REPORTS_KEY,
      JSON.stringify([
        { activityId: 100, profileId: 1 },
        { activityId: 101, profileId: 2 },
      ]),
    );
    useEndpointStatuses({
      profiles: [overLimitProfile({ id: 1 }), overLimitProfile({ id: 2 })],
      activities: [
        succeededActivity({ id: 100, result_text: "audits/report-100.csv" }),
        succeededActivity({ id: 101, result_text: "audits/report-101.csv" }),
      ],
    });

    const anchorClick = vi
      .spyOn(HTMLAnchorElement.prototype, "click")
      .mockImplementation(() => undefined);

    renderWithProviders(
      <>
        <USGProfilesNotifications
          isRetentionNotificationVisible={false}
          hideRetentionNotification={vi.fn()}
        />
        <LocationDisplay />
      </>,
      undefined,
      "/usg-profiles",
    );

    expect(
      await screen.findByRole("heading", {
        name: "Your audits are ready for download:",
      }),
    ).toBeInTheDocument();
    expect(
      await screen.findByRole("heading", {
        name: "Profiles exceeded associated instance limit:",
      }),
    ).toBeInTheDocument();

    await userEvent.click(
      screen.getByRole("button", { name: "Download audits" }),
    );
    await waitFor(() => {
      expect(anchorClick).toHaveBeenCalledTimes(2);
    });

    await userEvent.click(
      screen.getByRole("button", { name: "View profiles" }),
    );
    await waitFor(() => {
      expect(getLocationDisplay()).toHaveTextContent("status=over-limit");
    });

    await userEvent.click(
      screen.getByRole("button", { name: "Close notification" }),
    );

    await waitFor(() => {
      expect(
        screen.queryByRole("heading", {
          name: "Your audits are ready for download:",
        }),
      ).not.toBeInTheDocument();
    });
  });
});
