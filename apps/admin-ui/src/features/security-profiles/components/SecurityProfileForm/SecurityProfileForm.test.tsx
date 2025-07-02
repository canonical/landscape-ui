import { DEFAULT_ACCESS_GROUP_NAME, INPUT_DATE_TIME_FORMAT } from "@/constants";
import { renderWithProviders } from "@/tests/render";
import { act, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import moment from "moment";
import { type ComponentProps } from "react";
import { describe, it } from "vitest";
import SecurityProfileForm from "./SecurityProfileForm";

describe("SecurityProfileForm", () => {
  const props: ComponentProps<typeof SecurityProfileForm> = {
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
      randomize_delivery: "no",
      restart_deliver_delay: 0,
      restart_deliver_delay_window: 0,
      start_date: moment().format(INPUT_DATE_TIME_FORMAT),
      start_type: "on-a-date",
      tags: [],
      tailoring_file: null,
      title: "New profile",
      unit_of_time: "DAILY",
    },
    mutate: vi.fn(),
    submitButtonText: "Submit",
  };

  it("should allow you to go back", async () => {
    renderWithProviders(<SecurityProfileForm {...props} />);

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
      <SecurityProfileForm
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
    renderWithProviders(<SecurityProfileForm {...props} />);

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

    expect(
      await screen.findByRole("button", { name: "Submit" }),
    ).toBeDisabled();
  });
});
