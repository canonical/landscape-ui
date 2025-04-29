import { INPUT_DATE_TIME_FORMAT } from "@/constants";
import { renderWithProviders } from "@/tests/render";
import { screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import moment from "moment";
import type { ComponentProps } from "react";
import { describe, it } from "vitest";
import ScriptProfileForm from "./ScriptProfileForm";

describe("ScriptProfileForm", () => {
  const props: ComponentProps<typeof ScriptProfileForm> = {
    initialValues: {
      all_computers: false,
      interval: "0 0 * * *",
      start_after: moment().format(INPUT_DATE_TIME_FORMAT),
      tags: [],
      time_limit: 300,
      timestamp: moment().format(INPUT_DATE_TIME_FORMAT),
      title: "New profile",
      trigger_type: "event",
      username: "root",
      script_id: 0,
    },
    onSubmit: vi.fn(),
    onSuccess: vi.fn(),
    submitButtonText: "Submit",
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("should submit with event type", async () => {
    renderWithProviders(<ScriptProfileForm {...props} />);

    const submitButton = await screen.findByRole("button", { name: "Submit" });

    await userEvent.click(submitButton);

    expect(props.onSubmit).toHaveBeenCalledTimes(1);
    expect(props.onSuccess).toHaveBeenCalledTimes(1);
  });

  it("should submit with one-time type", async () => {
    renderWithProviders(
      <ScriptProfileForm
        {...props}
        initialValues={{ ...props.initialValues, trigger_type: "one_time" }}
      />,
    );

    const submitButton = await screen.findByRole("button", { name: "Submit" });

    await userEvent.click(submitButton);

    expect(props.onSubmit).toHaveBeenCalledTimes(1);
    expect(props.onSuccess).toHaveBeenCalledTimes(1);
  });

  it("should submit with recurring type", async () => {
    renderWithProviders(
      <ScriptProfileForm
        {...props}
        initialValues={{ ...props.initialValues, trigger_type: "recurring" }}
      />,
    );

    const submitButton = await screen.findByRole("button", { name: "Submit" });

    await userEvent.click(submitButton);

    expect(props.onSubmit).toHaveBeenCalledTimes(1);
    expect(props.onSuccess).toHaveBeenCalledTimes(1);
  });
});
