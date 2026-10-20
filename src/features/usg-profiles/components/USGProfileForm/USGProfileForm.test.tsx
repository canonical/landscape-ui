import {
  API_URL,
  DEFAULT_ACCESS_GROUP_NAME,
  INPUT_DATE_TIME_FORMAT,
} from "@/constants";
import { setEndpointStatus } from "@/tests/controllers/controller";
import { usgProfiles } from "@/tests/mocks/usgProfiles";
import { renderWithProviders } from "@/tests/render";
import server from "@/tests/server";
import { act, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import date from "@/libs/date";
import { http, HttpResponse } from "msw";
import { type ComponentProps } from "react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { getInitialValues } from "../../helpers";
import USGProfileForm from "./USGProfileForm";

const getProps = (): ComponentProps<typeof USGProfileForm> => ({
  formMode: "add",
  initialValues: {
    access_group: DEFAULT_ACCESS_GROUP_NAME,
    all_computers: false,
    benchmark: "cis_level1_server",
    day_of_month_type: "day-of-month",
    days: [],
    delivery_time: "asap",
    end_date: "",
    end_type: "never",
    every: 1,
    mode: "audit",
    months: [],
    randomize_delivery: false,
    restart_deliver_delay: 0,
    deliver_delay_window: 0,
    start_date: date().format(INPUT_DATE_TIME_FORMAT),
    start_type: "on-a-date",
    tags: [],
    tailoring_file: null,
    title: "New profile",
    unit_of_time: "DAILY",
  },
  mutate: vi.fn(async () => undefined),
  submitButtonText: "Submit",
});

describe("USGProfileForm", () => {
  const props = getProps();

  it("should allow you to go back", async () => {
    renderWithProviders(<USGProfileForm {...props} />);

    expect(
      screen.queryByRole("button", { name: "Back" }),
    ).not.toBeInTheDocument();

    await userEvent.click(
      await screen.findByRole("button", { name: props.submitButtonText }),
    );

    await userEvent.click(screen.getByRole("button", { name: "Back" }));

    expect(
      screen.queryByRole("button", { name: "Back" }),
    ).not.toBeInTheDocument();
  });

  it("should work without confirmation", async () => {
    const onSuccess = vi.fn();

    renderWithProviders(
      <USGProfileForm
        {...props}
        getConfirmationStepDisabled={() => true}
        onSuccess={onSuccess}
      />,
    );

    await userEvent.click(
      await screen.findByRole("button", { name: props.submitButtonText }),
    );

    expect(onSuccess).toHaveBeenCalledTimes(1);
  });

  it("should require a minimum interval of 7 days", async () => {
    const mutate = vi.fn();

    renderWithProviders(<USGProfileForm {...props} mutate={mutate} />);

    await userEvent.selectOptions(
      screen.getByRole("combobox", { name: "Schedule" }),
      "recurring",
    );

    const everyField = screen.getByRole("spinbutton", {
      name: "Repeat every",
    });

    await userEvent.clear(everyField);
    await userEvent.type(everyField, "6");

    act(() => {
      everyField.blur();
    });

    expect(
      await screen.findByText("Enter an interval of at least 7 days."),
    ).toBeInTheDocument();

    const submitButton = await screen.findByRole("button", { name: "Submit" });
    expect(submitButton).not.toHaveAttribute("aria-disabled", "true");

    await userEvent.click(submitButton);

    expect(mutate).not.toHaveBeenCalled();
  });

  it("should block submit when required fields are invalid", async () => {
    const mutate = vi.fn();

    renderWithProviders(
      <USGProfileForm
        {...props}
        mutate={mutate}
        initialValues={{
          ...props.initialValues,
          title: "",
          benchmark: undefined,
          mode: undefined,
        }}
      />,
    );

    await userEvent.click(
      await screen.findByRole("button", { name: props.submitButtonText }),
    );

    expect(mutate).not.toHaveBeenCalled();
    const requiredErrors = await screen.findAllByText(
      "This field is required.",
    );
    expect(requiredErrors.length).toBeGreaterThan(0);
  });

  it("should block advancing when recurring weekly has no day selected", async () => {
    renderWithProviders(<USGProfileForm {...props} />);

    await userEvent.selectOptions(
      screen.getByRole("combobox", { name: "Schedule" }),
      "recurring",
    );

    const unitSelectWeekly = screen
      .getAllByRole("combobox")
      .find((el) => el.getAttribute("name") === "unit_of_time");
    expect(unitSelectWeekly).toBeInTheDocument();
    await userEvent.selectOptions(unitSelectWeekly as HTMLElement, "WEEKLY");

    await userEvent.click(
      await screen.findByRole("button", { name: "Submit" }),
    );

    await waitFor(() => {
      expect(
        screen.queryByRole("button", { name: "Back" }),
      ).not.toBeInTheDocument();
      expect(screen.getByText("Select at least one day.")).toBeInTheDocument();
    });
  });

  it("should block advancing when recurring yearly has no month selected", async () => {
    renderWithProviders(<USGProfileForm {...props} />);

    await userEvent.selectOptions(
      screen.getByRole("combobox", { name: "Schedule" }),
      "recurring",
    );

    const unitSelectYearly = screen
      .getAllByRole("combobox")
      .find((el) => el.getAttribute("name") === "unit_of_time");
    expect(unitSelectYearly).toBeInTheDocument();
    await userEvent.selectOptions(unitSelectYearly as HTMLElement, "YEARLY");

    await userEvent.click(
      await screen.findByRole("button", { name: "Submit" }),
    );

    await waitFor(() => {
      expect(
        screen.queryByRole("button", { name: "Back" }),
      ).not.toBeInTheDocument();
      expect(
        screen.getByText("Select at least one month."),
      ).toBeInTheDocument();
    });
  });

  describe.each(["add", "edit"] as const)(
    "saved end dates (%s)",
    (formMode) => {
      it.each([
        ["20271231T120000Z", "2027-12-31T12:00"],
        ["20270328T023000Z", "2027-03-28T02:30"],
      ])("preserves UNTIL=%s on submission", async (until, endDate) => {
        const testProps = getProps();
        const profile = {
          ...usgProfiles[1],
          schedule: `FREQ=DAILY;INTERVAL=7;UNTIL=${until}`,
          next_run_time: "2027-01-01T00:00:00",
        };
        renderWithProviders(
          <USGProfileForm
            {...testProps}
            formMode={formMode}
            initialValues={getInitialValues(profile)}
            getConfirmationStepDisabled={() => true}
          />,
        );

        expect(screen.getByLabelText("End date")).toHaveValue(endDate);

        await userEvent.click(
          await screen.findByRole("button", {
            name: testProps.submitButtonText,
          }),
        );

        await waitFor(() => {
          expect(testProps.mutate).toHaveBeenCalledWith(
            expect.objectContaining({ schedule: profile.schedule }),
          );
        });
      });

      it.each([
        ["2027-01-01T12:00:00", "2027-01-01T12:00", "20270101T123000Z"],
        ["2027-01-01T12:00:00Z", "2027-01-01T12:00", "20270101T123000Z"],
        ["2027-01-01T14:00:00+02:00", "2027-01-01T12:00", "20270101T123000Z"],
        ["2027-03-28T02:30:00", "2027-03-28T02:30", "20270328T030000Z"],
      ])(
        "validates and submits a UTC end date shortly after %s",
        async (nextRun, startField, until) => {
          const testProps = getProps();
          const profile = {
            ...usgProfiles[1],
            schedule: `FREQ=DAILY;INTERVAL=7;UNTIL=${until}`,
            next_run_time: nextRun,
          };
          renderWithProviders(
            <USGProfileForm
              {...testProps}
              formMode={formMode}
              initialValues={getInitialValues(profile)}
              getConfirmationStepDisabled={() => true}
            />,
          );

          expect(screen.getByLabelText("Start date")).toHaveValue(startField);
          await userEvent.click(
            await screen.findByRole("button", {
              name: testProps.submitButtonText,
            }),
          );

          await waitFor(() => {
            expect(testProps.mutate).toHaveBeenCalledWith(
              expect.objectContaining({
                start_date: `${startField}:00Z`,
                schedule: profile.schedule,
              }),
            );
          });
        },
      );

      it.each(["20270328T030000Z", "20270328T023000Z"])(
        "rejects UNTIL=%s at or before the UTC start, including DST gaps",
        async (until) => {
          const testProps = getProps();
          const profile = {
            ...usgProfiles[1],
            schedule: `FREQ=DAILY;INTERVAL=7;UNTIL=${until}`,
            next_run_time: "2027-03-28T03:00:00",
          };

          renderWithProviders(
            <USGProfileForm
              {...testProps}
              formMode={formMode}
              initialValues={getInitialValues(profile)}
              getConfirmationStepDisabled={() => true}
            />,
          );

          await userEvent.click(
            await screen.findByRole("button", {
              name: testProps.submitButtonText,
            }),
          );

          expect(
            await screen.findByText(
              "The end date must be after the start date.",
            ),
          ).toBeInTheDocument();
          expect(testProps.mutate).not.toHaveBeenCalled();
        },
      );
    },
  );

  it("shows the UTC next-run fields on the confirmation step at a DST boundary", async () => {
    renderWithProviders(
      <USGProfileForm
        {...props}
        initialValues={{
          ...props.initialValues,
          start_date: "2027-03-28T02:30:00",
        }}
      />,
    );

    await userEvent.click(
      await screen.findByRole("button", { name: props.submitButtonText }),
    );

    expect(await screen.findByText(/Mar 28, 2027, 02:30/)).toBeInTheDocument();
  });

  describe("USGProfileForm instances request params", () => {
    const props = getProps();

    let capturedUrl: URL | undefined;

    beforeEach(() => {
      capturedUrl = undefined;
      setEndpointStatus("default");

      server.use(
        http.get(`${API_URL}computers`, ({ request }) => {
          capturedUrl = new URL(request.url);
          return HttpResponse.json({
            results: [],
            count: 0,
            next: null,
            previous: null,
          });
        }),
      );
    });

    it("omits query entirely when no tags are selected", async () => {
      renderWithProviders(<USGProfileForm {...props} />);

      await vi.waitFor(() => {
        expect(capturedUrl).toBeDefined();
      });

      expect(capturedUrl?.searchParams.has("query")).toBe(false);
    });
  });
});
