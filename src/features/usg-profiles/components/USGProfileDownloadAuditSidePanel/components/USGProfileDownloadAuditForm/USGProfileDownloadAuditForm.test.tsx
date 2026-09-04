import type { Activity } from "@/features/activities";
import date from "@/libs/date";
import { setEndpointStatus } from "@/tests/controllers/controller";
import { expectErrorNotification } from "@/tests/helpers";
import { usgProfiles } from "@/tests/mocks/usgProfiles";
import { renderWithProviders } from "@/tests/render";
import { fireEvent, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import USGProfileDownloadAuditForm from "./USGProfileDownloadAuditForm";

const [usgProfile] = usgProfiles;

const PENDING_REPORTS_KEY = "_landscape_pendingSecurityProfileReports";

const baseActivity: Activity = {
  activity_status: "undelivered",
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

describe("USGProfileDownloadAuditForm", () => {
  beforeEach(() => {
    localStorage.clear();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it("renders timeframe and detail level controls", () => {
    renderWithProviders(
      <USGProfileDownloadAuditForm usgProfile={usgProfile} />,
    );

    expect(screen.getByText("Audit timeframe")).toBeInTheDocument();
    expect(screen.getByText("Specific date")).toBeInTheDocument();
    expect(screen.getByText("Date range")).toBeInTheDocument();
    expect(screen.getByText("Level of detail")).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: "Generate CSV" }),
    ).toBeInTheDocument();
  });

  it("shows the ready notification after generating an audit", async () => {
    renderWithProviders(
      <USGProfileDownloadAuditForm usgProfile={usgProfile} />,
    );

    await userEvent.click(screen.getByRole("button", { name: "Generate CSV" }));

    expect(
      await screen.findByText("Your requested audit is ready:"),
    ).toBeInTheDocument();
  });

  it("validates that the end date is not before the start date for a range", async () => {
    const { container } = renderWithProviders(
      <USGProfileDownloadAuditForm usgProfile={usgProfile} />,
    );

    await userEvent.click(screen.getByRole("radio", { name: "Date range" }));

    const dateInputs =
      container.querySelectorAll<HTMLInputElement>('input[type="date"]');
    const endDateInput = dateInputs[dateInputs.length - 1];
    assert(endDateInput, "End date input not found");

    fireEvent.change(endDateInput, {
      target: { value: date().subtract(1, "day").format("YYYY-MM-DD") },
    });
    fireEvent.blur(endDateInput);

    expect(
      await screen.findByText(
        "The end date must not be before the start date.",
      ),
    ).toBeInTheDocument();
  });

  it("keeps showing the pending notification while the audit is still generating", async () => {
    setEndpointStatus({
      status: "variant",
      path: "usg-profiles/report",
      response: { ...baseActivity, id: 115, activity_status: "undelivered" },
    });

    renderWithProviders(
      <USGProfileDownloadAuditForm usgProfile={usgProfile} />,
    );

    await userEvent.click(screen.getByRole("button", { name: "Generate CSV" }));

    expect(
      await screen.findByText("Your audit is being generated:"),
    ).toBeInTheDocument();
  });

  it("downloads the ready audit and dismisses the notification", async () => {
    setEndpointStatus({
      status: "variant",
      path: "usg-profiles/report",
      response: {
        ...baseActivity,
        id: 42,
        activity_status: "succeeded",
        result_text: "audits/usg-profile-report-0.csv",
      },
    });

    const anchorClick = vi
      .spyOn(HTMLAnchorElement.prototype, "click")
      .mockImplementation(() => undefined);
    const createElementSpy = vi.spyOn(document, "createElement");

    renderWithProviders(
      <USGProfileDownloadAuditForm usgProfile={usgProfile} />,
    );

    await userEvent.click(screen.getByRole("button", { name: "Generate CSV" }));

    expect(
      await screen.findByText("Your requested audit is ready:"),
    ).toBeInTheDocument();

    await userEvent.click(
      screen.getByRole("button", { name: "Download audit" }),
    );

    await waitFor(() => {
      expect(anchorClick).toHaveBeenCalledOnce();
    });

    const anchor = createElementSpy.mock.results.find(
      (result) => result.value instanceof HTMLAnchorElement,
    )?.value as HTMLAnchorElement;

    expect(anchor.download).toBe("usg-profile-report-0.csv");

    await userEvent.click(
      screen.getByRole("button", { name: "Close notification" }),
    );

    expect(
      screen.queryByText("Your requested audit is ready:"),
    ).not.toBeInTheDocument();
  });

  it("updates an existing pending report and clears storage on dismiss", async () => {
    localStorage.setItem(
      PENDING_REPORTS_KEY,
      JSON.stringify([{ activityId: 5, profileId: usgProfile.id }]),
    );

    renderWithProviders(
      <USGProfileDownloadAuditForm usgProfile={usgProfile} />,
    );

    await userEvent.click(screen.getByRole("button", { name: "Generate CSV" }));

    await userEvent.click(
      await screen.findByRole("button", { name: "Close notification" }),
    );

    expect(
      screen.queryByText("Your requested audit is ready:"),
    ).not.toBeInTheDocument();
    expect(localStorage.getItem(PENDING_REPORTS_KEY)).toBeNull();
  });

  it("keeps other pending reports when dismissing", async () => {
    localStorage.setItem(
      PENDING_REPORTS_KEY,
      JSON.stringify([
        { activityId: 5, profileId: usgProfile.id },
        { activityId: 7, profileId: 99 },
      ]),
    );

    renderWithProviders(
      <USGProfileDownloadAuditForm usgProfile={usgProfile} />,
    );

    await userEvent.click(screen.getByRole("button", { name: "Generate CSV" }));

    await userEvent.click(
      await screen.findByRole("button", { name: "Close notification" }),
    );

    const remaining = JSON.parse(
      localStorage.getItem(PENDING_REPORTS_KEY) ?? "[]",
    ) as { activityId: number; profileId: number }[];

    expect(remaining).toEqual([{ activityId: 7, profileId: 99 }]);
  });

  it("shows an error notification when report generation fails", async () => {
    setEndpointStatus({ status: "error", path: "usg-profiles/report" });

    renderWithProviders(
      <USGProfileDownloadAuditForm usgProfile={usgProfile} />,
    );

    await userEvent.click(screen.getByRole("button", { name: "Generate CSV" }));

    await expectErrorNotification();

    expect(
      screen.queryByText("Your requested audit is ready:"),
    ).not.toBeInTheDocument();
  });

  it("stops showing the pending notification when the activity poll fails", async () => {
    setEndpointStatus({ status: "error", path: "activities/:id" });

    renderWithProviders(
      <USGProfileDownloadAuditForm usgProfile={usgProfile} />,
    );

    await userEvent.click(screen.getByRole("button", { name: "Generate CSV" }));

    await waitFor(() => {
      expect(
        screen.queryByText("Your audit is being generated:"),
      ).not.toBeInTheDocument();
    });

    expect(
      screen.queryByText("Your requested audit is ready:"),
    ).not.toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: "Generate CSV" }),
    ).toBeInTheDocument();
  });
});
